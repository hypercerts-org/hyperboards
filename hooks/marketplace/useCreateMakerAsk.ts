import { useAccount, useChainId, useMutation, useWalletClient } from "wagmi";
import { isAddress, parseEther } from "viem";
import { Provider } from "ethers";
import { waitForTransactionReceipt } from "viem/actions";
import { Order } from "@/components/marketplace/create-order-form";
import { useInteractionModal } from "@/components/interaction-modal";
import { useHypercertClient } from "@/components/providers";
import { QuoteType, LooksRare } from "@hypercerts-org/marketplace-sdk";
import { useCreateOrderInSupabase } from "@/hooks/marketplace/useCreateOrderInSupabase";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSigner";

export const useCreateMakerAsk = () => {
  const { onOpen, onClose, setStep } = useInteractionModal();
  const { mutateAsync: createOrder } = useCreateOrderInSupabase();

  const chainId = useChainId();
  const client = useHypercertClient();
  const { address } = useAccount();
  const { data: walletClientData } = useWalletClient();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  return useMutation(
    async (values: { fractionId: string; price: string }) => {
      if (!client) {
        throw new Error("Client not initialized");
      }

      if (!chainId) {
        throw new Error("Chain ID not initialized");
      }

      if (!address) {
        throw new Error("Address not initialized");
      }

      onOpen([
        {
          title: "Create",
          description: "Creating order in contract",
        },
        {
          title: "Approve transfer manager",
          description: "Approving transfer manager",
        },
        {
          title: "Approve collection",
          description: "Approving collection",
        },
        {
          title: "Sign order",
          description: "Signing order",
        },
        {
          title: "Create order",
          description: "Creating order",
        },
      ]);

      if (!client.config.publicClient) {
        throw new Error("Public client not initialized");
      }

      if (!provider) {
        throw new Error("Provider not initialized");
      }

      if (!signer) {
        throw new Error("Signer not initialized");
      }

      const [contractAddress, tokenId] = values.fractionId.split("-");

      if (!contractAddress || !isAddress(contractAddress)) {
        throw new Error("Invalid contract address");
      }

      let tokenIdBigInt: BigInt | undefined;
      try {
        tokenIdBigInt = BigInt(tokenId);
      } catch (e) {
        console.error(e);
        throw new Error("Error parsing token ID");
      }

      if (!tokenIdBigInt) {
        throw new Error("Invalid token ID");
      }

      if (!walletClientData) {
        throw new Error("Wallet client not initialized");
      }

      const lr = new LooksRare(
        chainId,
        // TODO: Fix typing issue with provider
        // @ts-ignore
        provider as unknown as Provider,
        // @ts-ignore
        signer,
      );
      const order: Order = {
        collection: contractAddress,
        collectionType: 2,
        strategyId: 0,
        subsetNonce: 0, // keep 0 if you don't know what it is used for
        orderNonce: 0, // You need to retrieve this value from the API
        startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
        endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
        price: parseEther(values.price), // Be careful to use a price in wei, this example is for 1 ETH
        itemIds: [tokenIdBigInt.toString(10)], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
        additionalParams: "0x",
        amounts: [1],
        currency: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      };

      let signature: string | undefined;

      try {
        setStep("Create");
        const { maker, isCollectionApproved, isTransferManagerApproved } =
          await lr.createMakerAsk({
            ...order,
          });

        // Grant the TransferManager the right the transfer assets on behalf od the LooksRareProtocol
        setStep("Approve transfer manager");
        if (!isTransferManagerApproved) {
          const tx = await lr.grantTransferManagerApproval().call();
          await waitForTransactionReceipt(walletClientData, {
            hash: tx.hash as `0x${string}`,
          });
        }

        setStep("Approve collection");
        // Approve the collection items to be transferred by the TransferManager
        if (!isCollectionApproved) {
          const tx = await lr.approveAllCollectionItems(maker.collection);
          await waitForTransactionReceipt(walletClientData, {
            hash: tx.hash as `0x${string}`,
          });
        }

        // Sign your maker order
        setStep("Sign order");
        signature = await lr.signMakerOrder(maker);
      } catch (e) {
        console.error(e);
        throw new Error("Error signing order");
      }

      if (!signature) {
        throw new Error("Error signing order");
      }

      try {
        setStep("Create order");
        await createOrder({
          order,
          signature: signature!,
          signer: address,
          globalNonce: 0,
          quoteType: QuoteType.Ask,
        });
      } catch (e) {
        throw new Error("Error creating order");
      }
    },
    {
      onSettled: () => {
        onClose();
      },
    },
  );
};
