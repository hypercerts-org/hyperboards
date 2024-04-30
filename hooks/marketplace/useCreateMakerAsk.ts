import { useAccount, useChainId, useWalletClient } from "wagmi";
import { isAddress, parseEther } from "viem";
import { Provider } from "ethers";
import { waitForTransactionReceipt } from "viem/actions";
import { useInteractionModal } from "@/components/interaction-modal";
import { useHypercertClient } from "@/components/providers";
import {
  HypercertExchangeClient,
  QuoteType,
} from "@hypercerts-org/marketplace-sdk";
import { useCreateOrderInSupabase } from "@/hooks/marketplace/useCreateOrderInSupabase";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { CreateOfferFormValues } from "@/components/marketplace/create-order-form";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { constructTokenIdsFromSplitFractionContractReceipt } from "@/utils/constructTokenIdsFromSplitFractionContractReceipt";
import { useMutation } from "@tanstack/react-query";
import { parseClaimOrFractionId } from "@hypercerts-org/sdk";

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

  return useMutation({
    mutationKey: ["createMakerAsk"],
    mutationFn: async (values: CreateOfferFormValues) => {
      // if (!client?.isClaimOrFractionOnConnectedChain(values.fractionId)) {
      //   throw new Error("Claim not on connected chain");
      // }
      //
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

      if (!provider) {
        throw new Error("Provider not initialized");
      }

      if (!signer) {
        throw new Error("Signer not initialized");
      }

      const { contractAddress } = parseClaimOrFractionId(values.fractionId);

      if (!contractAddress || !isAddress(contractAddress)) {
        throw new Error("Invalid contract address");
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

      // Total units in claim
      const totalUnits = currentFractions.reduce(
        (acc, cur) => acc + BigInt(cur.units),
        0n,
      );
      const listingsWithUnits = values.listings.map((listing) => {
        if (!listing.percentage) {
          throw new Error("Invalid percentage");
        }

        return {
          ...listing,
          units: (totalUnits * BigInt(listing.percentage * 10000)) / 1000000n,
        };
      });

      // Calculate rest amount of units in fraction (value of leftover token)
      const restAmount =
        BigInt(selectedFraction?.units) -
        listingsWithUnits.reduce((acc, cur) => acc + cur.units, 0n);

      // Perform the split and await confirmation
      // const hash = await client.splitFractionUnits(
      //   BigInt(selectedFraction.tokenID),
      //   [restAmount, ...listingsWithUnits.map((x) => x.units)],
      // );
      // if (!hash) {
      //   throw new Error("No hash found for splitting transaction");
      // }
      // setStep("Waiting");
      // const receipt = await waitForTransactionReceipt(walletClientData, {
      //   confirmations: 3,
      //   hash: hash,
      // });
      //
      // if (!receipt || receipt?.status === "reverted") {
      //   throw new Error("Splitting failed");
      // }
      //
      // // Get new token ids and their corresponding values
      // const newTokenIds =
      //   constructTokenIdsFromSplitFractionContractReceipt(receipt);

      let signature: string | undefined;

      for (let index = 0; index < listingsWithUnits.length; index++) {
        const listing = listingsWithUnits[index];

        // Find the entry for the newly split token with the right amount of units
        // const newTokenEntryIndex = newTokenIds.findIndex(
        //   (newTokenId) => newTokenId.value === listing.units,
        // );
        // const { tokenId } = newTokenIds[newTokenEntryIndex];

        // Remove the entry for the newly split token from the list of new token ids so there is only one order created per token
        // newTokenIds.splice(newTokenEntryIndex, 1);

        if (!listing.price) {
          throw new Error("Invalid price");
        }

        try {
          setStep("Create");
          const hypercertExchangeClient = new HypercertExchangeClient(
            chainId,
            // TODO: Fix typing issue with provider
            // @ts-ignore
            provider as unknown as Provider,
            // @ts-ignore
            signer,
            {
              apiEndpoint:
                process.env.NEXT_PUBLIC_HYPERCERTS_MARKETPLACE_API_URL,
            },
          );

          const { maker, isCollectionApproved, isTransferManagerApproved } =
            await hypercertExchangeClient.createDirectFractionsSaleMakerAsk({
              startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
              endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
              price: parseEther(listing.price), // Be careful to use a price in wei, this example is for 1 ETH
              itemIds: [
                parseClaimOrFractionId(values.fractionId).id.toString(),
              ], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
            });

          // Grant the TransferManager the right the transfer assets on behalf od the LooksRareProtocol
          setStep("Approve transfer manager");
          if (!isTransferManagerApproved) {
            const tx = await hypercertExchangeClient
              .grantTransferManagerApproval()
              .call();
            await waitForTransactionReceipt(walletClientData, {
              hash: tx.hash as `0x${string}`,
            });
          }

          setStep("Approve collection");
          // Approve the collection items to be transferred by the TransferManager
          if (!isCollectionApproved) {
            const tx = await hypercertExchangeClient.approveAllCollectionItems(
              maker.collection,
            );
            await waitForTransactionReceipt(walletClientData, {
              hash: tx.hash as `0x${string}`,
            });
          }

          // Sign your maker order
          setStep("Sign order");
          signature = await hypercertExchangeClient.signMakerOrder(maker);

          if (!signature) {
            throw new Error("Error signing order");
          }

          setStep("Create order");
          await createOrder({
            order: maker,
            signature: signature,
            signer: address,
            quoteType: QuoteType.Ask,
          });
        } catch (e) {
          console.error(e);
          throw new Error("Error signing order");
        }
      }
    },
    onSettled: () => {
      onClose();
    },
  });
};
