import { useChainId, useMutation } from "wagmi";
import { Order } from "@/components/marketplace/create-order-form";
import { HYPERCERTS_MARKETPLACE_API_URL } from "@/config";
import { QuoteType } from "../../../marketplace-sdk";

export const useCreateOrder = () => {
  const chainId = useChainId();

  return useMutation(
    async ({
      order,
      signer,
      signature,
      quoteType,
      globalNonce,
      currency,
    }: {
      order: Order;
      signer: string;
      signature: string;
      quoteType: QuoteType;
      globalNonce: number;
      currency: string;
    }) => {
      if (!chainId) {
        throw new Error("No chainId");
      }

      const { additionalParams, ...orderWithoutAdditionalParams } = order;
      return fetch(`${HYPERCERTS_MARKETPLACE_API_URL}/marketplace/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderWithoutAdditionalParams,
          additionalParameters: additionalParams,
          price: order.price.toString(10),
          quoteType,
          signer,
          signature,
          chainId,
          globalNonce,
          currency,
        }),
      }).then((res) => res.json() as Promise<{ success: boolean }>);
    },
  );
};
