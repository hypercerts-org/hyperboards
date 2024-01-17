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
      const hash = await client.splitFractionUnits(
        BigInt(selectedFraction.tokenID),
        [restAmount, ...listingsWithUnits.map((x) => x.units)],
      );
      if (!hash) {
        throw new Error("No hash found for splitting transaction");
      }
      setStep("Waiting");
      const receipt = await waitForTransactionReceipt(walletClientData, {
        confirmations: 3,
        hash: hash,
      });

      if (!receipt || receipt?.status === "reverted") {
        throw new Error("Splitting failed");
      }

      // Get new token ids and their corresponding values
      const newTokenIds =
        constructTokenIdsFromSplitFractionContractReceipt(receipt);

      let signature: string | undefined;

      for (let index = 0; index < listingsWithUnits.length; index++) {
        const listing = listingsWithUnits[index];

        // Find the entry for the newly split token with the right amount of units
        const newTokenEntryIndex = newTokenIds.findIndex(
          (newTokenId) => newTokenId.value === listing.units,
        );
        const { tokenId } = newTokenIds[newTokenEntryIndex];

        // Remove the entry for the newly split token from the list of new token ids so there is only one order created per token
        newTokenIds.splice(newTokenEntryIndex, 1);

        if (!listing.price) {
          throw new Error("Invalid price");
        }

        try {
          setStep("Create");
          const { nonce_counter } = await fetchOrderNonce({
            address,
            chainId,
          });
          const lr = new LooksRare(
            chainId,
            // TODO: Fix typing issue with provider
            // @ts-ignore
            provider as unknown as Provider,
            // @ts-ignore
            signer,
          );
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
              currency: lr.addresses.WETH, // Currency used to pay the order, use WETH for ETH payment
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
