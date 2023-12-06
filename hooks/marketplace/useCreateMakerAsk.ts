import { useAccount, useChainId, useMutation, useWalletClient } from "wagmi";
import { isAddress, parseEther } from "viem";
import { Provider } from "ethers";
import { waitForTransactionReceipt } from "viem/actions";
import { useInteractionModal } from "@/components/interaction-modal";
import { useHypercertClient } from "@/components/providers";
import { LooksRare, QuoteType } from "@hypercerts-org/marketplace-sdk";
import { useCreateOrderInSupabase } from "@/hooks/marketplace/useCreateOrderInSupabase";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { fetchOrderNonce } from "@/hooks/marketplace/fetchOrderNonce";
import { CreateOfferFormValues } from "@/components/marketplace/create-order-form";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { constructTokenIdsFromSplitFractionContractReceipt } from "@/utils/constructTokenIdsFromSplitFractionContractReceipt";

export const useCreateMakerAsk = ({ hypercertId }: { hypercertId: string }) => {
  const { onOpen, onClose, setStep } = useInteractionModal();
  const { mutateAsync: createOrder } = useCreateOrderInSupabase();

  const chainId = useChainId();
  const client = useHypercertClient();
  const { address } = useAccount();
  const { data: walletClientData } = useWalletClient();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const { data: currentFractions } =
    useFetchHypercertFractionsByHypercertId(hypercertId);

  return useMutation(
    async (values: CreateOfferFormValues) => {
      if (!client) {
        throw new Error("Client not initialized");
      }

      if (!chainId) {
        throw new Error("Chain ID not initialized");
      }

      if (!address) {
        throw new Error("Address not initialized");
      }

      if (!currentFractions) {
        throw new Error("Fractions not found");
      }

      onOpen([
        {
          title: "Splitting",
          description: "Splitting fraction units on-chain",
        },
        {
          title: "Waiting",
          description: "Awaiting confirmation",
        },
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

      // Split the fraction into required parts
      setStep("Splitting");
      const selectedFraction = currentFractions.find(
        (fraction) => fraction.id === values.fractionId,
      );

      if (!selectedFraction) {
        throw new Error("Fraction not found");
      }
      const fractionAmounts = values.listings.map((listing) => {
        if (!listing.percentage) {
          throw new Error("Invalid percentage");
        }

        return (
          (BigInt(selectedFraction.units) *
            BigInt(listing.percentage * 10000)) /
          1000000n
        );
      });

      const restAmount =
        BigInt(selectedFraction?.units) -
        fractionAmounts.reduce((acc, cur) => acc + cur, 0n);

      console.log(
        selectedFraction.tokenID,
        fractionAmounts,
        client.config,
        client.contract,
      );
      const hash = await client.splitFractionUnits(
        BigInt(selectedFraction.tokenID),
        [...fractionAmounts, restAmount],
      );

      // Await split confirmation
      setStep("Waiting");
      const publicClient = client.config.publicClient;
      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
      });

      if (!receipt || receipt?.status === "reverted") {
        throw new Error("Splitting failed");
      }
      console.log(receipt);
      const newTokenIds =
        constructTokenIdsFromSplitFractionContractReceipt(receipt);
      console.log(newTokenIds);

      const lr = new LooksRare(
        chainId,
        // TODO: Fix typing issue with provider
        // @ts-ignore
        provider as unknown as Provider,
        // @ts-ignore
        signer,
      );

      let signature: string | undefined;

      for (let index = 0; index < values.listings.length; index++) {
        const listing = values.listings[index];
        const tokenId = newTokenIds[index];

        if (!listing.price) {
          throw new Error("Invalid price");
        }

        try {
          setStep("Create");
          const { nonce_counter } = await fetchOrderNonce({
            address,
            chainId,
          });
          const { maker, isCollectionApproved, isTransferManagerApproved } =
            await lr.createMakerAsk({
              collection: contractAddress,
              collectionType: 2,
              strategyId: 0,
              subsetNonce: 0, // keep 0 if you don't know what it is used for
              orderNonce: nonce_counter.toString(), // You need to retrieve this value from the API
              startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
              endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
              price: parseEther(listing.price), // Be careful to use a price in wei, this example is for 1 ETH
              itemIds: [tokenId.toString()], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
              amounts: [1],
              currency: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            });

          console.log(maker);

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

          if (!signature) {
            throw new Error("Error signing order");
          }

          setStep("Create order");
          await createOrder({
            order: maker,
            signature: signature!,
            signer: address,
            quoteType: QuoteType.Ask,
          });
        } catch (e) {
          console.error(e);
          throw new Error("Error signing order");
        }
      }
    },
    {
      onSettled: () => {
        onClose();
      },
    },
  );
};
