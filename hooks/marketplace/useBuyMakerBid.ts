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
import { useMutation } from "@tanstack/react-query";

export const useBuyMakerBid = () => {
  const chainId = useChainId();
  const { setStep, onOpen, onClose, getCurrentStep } = useInteractionModal();
  const { data: walletClientData } = useWalletClient();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const address = useAddress();
  const getCurrentAllowance = useGetCurrentERC20Allowance();

  return useMutation({
    mutationKey: ["buyMakerBid"],
    mutationFn: async ({ order }: { order: MarketplaceOrderEntity }) => {
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

      // @ts-ignore
      const lr = new HypercertExchangeClient(chainId, provider, signer, {
        apiEndpoint: process.env.NEXT_PUBLIC_HYPERCERTS_MARKETPLACE_API_URL,
      });
      setStep("Setting up order execution");
      const takerOrder = lr.createTaker(order, address);

      try {
        const currentAllowance = await getCurrentAllowance(
          order.currency as `0x${string}`,
        );
        setStep("ERC20");
        if (currentAllowance < BigInt(order.price)) {
          const approveTx = await lr.approveErc20(
            lr.addresses.WETH,
            BigInt(order.price),
          );
          await waitForTransactionReceipt(walletClientData, {
            hash: approveTx.hash as `0x${string}`,
          });
        }

        const isTransferManagerApproved = await lr.isTransferManagerApproved();
        if (!isTransferManagerApproved) {
          setStep("Transfer manager");
          const transferManagerApprove = await lr
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
        const { call } = lr.executeOrder(order, takerOrder, order.signature);
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
