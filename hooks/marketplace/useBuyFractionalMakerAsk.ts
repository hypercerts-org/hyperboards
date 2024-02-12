import { useChainId, useMutation, useWalletClient } from "wagmi";
import { waitForTransactionReceipt } from "viem/actions";
import { useInteractionModal } from "@/components/interaction-modal";
import { MarketplaceOrderEntity } from "@/types/database-entities";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { useAddress } from "@/hooks/useAddress";
import { decodeContractError } from "@/utils/decodeContractError";
import { useGetCurrentERC20Allowance } from "@/hooks/marketplace/useGetCurrentERC20Allowance";
import { parseEther } from "viem";

export const useBuyFractionalMakerAsk = () => {
  const chainId = useChainId();
  const { setStep, onOpen, onClose, getCurrentStep } = useInteractionModal();
  const { data: walletClientData } = useWalletClient();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const address = useAddress();
  const currentAllowance = useGetCurrentERC20Allowance();

  return useMutation(
    async ({
      order,
      unitAmount,
      pricePerUnit,
    }: {
      order: MarketplaceOrderEntity;
      unitAmount: string;
      pricePerUnit: string;
    }) => {
      if (!chainId) {
        onClose();
        throw new Error("No chain id");
      }

      if (!walletClientData) {
        onClose();
        throw new Error("No wallet client data");
      }

      onOpen([
        {
          title: "Setting up order execution",
          description: "Setting up order execution",
        },
        {
          title: "Setting approval",
          description: "Setting approval",
        },
        {
          title: "Awaiting buy signature",
          description: "Awaiting buy signature",
        },

        {
          title: "Awaiting confirmation",
          description: "Awaiting confirmation",
        },
      ]);

      // @ts-ignore
      const hypercertExchangeClient = new HypercertExchangeClient(
        chainId,
        provider,
        signer,
      );
      setStep("Setting up order execution");
      const takerOrder = hypercertExchangeClient.createFractionalSaleTakerBid(
        order,
        address,
        unitAmount,
        parseEther(pricePerUnit),
      );

      try {
        setStep("Setting approval");
        if (currentAllowance < BigInt(order.price) * BigInt(unitAmount)) {
          const approveTx = await hypercertExchangeClient.approveErc20(
            hypercertExchangeClient.addresses.WETH,
            BigInt(order.price) * BigInt(unitAmount),
          );
          await waitForTransactionReceipt(walletClientData, {
            hash: approveTx.hash as `0x${string}`,
          });
        }

        const isTransferManagerApproved =
          await hypercertExchangeClient.isTransferManagerApproved();
        if (!isTransferManagerApproved) {
          setStep("Setting approval");
          const transferManagerApprove = await hypercertExchangeClient
            .grantTransferManagerApproval()
            .call();
          await waitForTransactionReceipt(walletClientData, {
            hash: transferManagerApprove.hash as `0x${string}`,
          });
        }
      } catch (e) {
        console.error(e);
        onClose();
        throw new Error("Approval error");
      }

      try {
        setStep("Setting up order execution");
        const { call } = hypercertExchangeClient.executeOrder(
          order,
          takerOrder,
          order.signature,
        );
        setStep("Awaiting buy signature");
        const tx = await call();
        setStep("Awaiting confirmation");
        await waitForTransactionReceipt(walletClientData, {
          hash: tx.hash as `0x${string}`,
        });
      } catch (e) {
        console.error(e);
        const currentStep = getCurrentStep();
        const defaultMessage = `Error during step \"${currentStep}\"`;
        throw new Error(decodeContractError(e, defaultMessage));
      } finally {
        onClose();
      }
    },
  );
};
