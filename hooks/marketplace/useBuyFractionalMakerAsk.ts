import { useChainId, useWalletClient } from "wagmi";
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
import { useMutation } from "@tanstack/react-query";

export const useBuyFractionalMakerAsk = () => {
  const chainId = useChainId();
  const { setStep, onOpen, onClose, getCurrentStep } = useInteractionModal();
  const { data: walletClientData } = useWalletClient();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const address = useAddress();
  const getCurrentERC20Allowance = useGetCurrentERC20Allowance();

  return useMutation({
    mutationKey: ["buyFractionalMakerAsk"],
    mutationFn: async ({
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
          title: "ERC20",
          description: "Setting approval",
        },
        {
          title: "Transfer manager",
          description: "Approving transfer manager",
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

      const hypercertExchangeClient = new HypercertExchangeClient(
        chainId,
        // @ts-ignore
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
        setStep("ERC20");
        const currentAllowance = await getCurrentERC20Allowance(
          order.currency as `0x${string}`,
        );
        if (currentAllowance < BigInt(order.price) * BigInt(unitAmount)) {
          const approveTx = await hypercertExchangeClient.approveErc20(
            order.currency,
            BigInt(order.price) * BigInt(unitAmount),
          );
          await waitForTransactionReceipt(walletClientData, {
            hash: approveTx.hash as `0x${string}`,
          });
        }

        setStep("Transfer manager");
        const isTransferManagerApproved =
          await hypercertExchangeClient.isTransferManagerApproved();
        if (!isTransferManagerApproved) {
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
  });
};
