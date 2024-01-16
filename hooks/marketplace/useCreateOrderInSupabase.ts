import { useChainId, useMutation } from "wagmi";
import { QuoteType, Maker, utils } from "@hypercerts-org/marketplace-sdk";

export const useCreateOrderInSupabase = () => {
  const chainId = useChainId();

  return useMutation(
    async ({
      order,
      signer,
      signature,
      quoteType,
    }: {
      order: Maker;
      signer: string;
      signature: string;
      quoteType: QuoteType;
      // currency: string;
    }) => {
      if (!chainId) {
        throw new Error("No chainId");
      }

      return utils.api.createOrder({
        order,
        signer,
        signature,
        quoteType,
        chainId,
      });
    },
  );
};
