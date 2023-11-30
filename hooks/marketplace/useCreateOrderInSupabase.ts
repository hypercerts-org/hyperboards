import { useChainId, useMutation } from "wagmi";
import { HYPERCERTS_MARKETPLACE_API_URL } from "@/config";
import { QuoteType, Maker } from "@hypercerts-org/marketplace-sdk";

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

      const { globalNonce, ...orderWithoutGlobalNonce } = order;

      return fetch(`${HYPERCERTS_MARKETPLACE_API_URL}/marketplace/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderWithoutGlobalNonce,
          globalNonce: globalNonce.toString(10),
          price: order.price.toString(10),
          quoteType,
          signer,
          signature,
          chainId,
        }),
      }).then((res) => res.json() as Promise<{ success: boolean }>);
    },
  );
};
