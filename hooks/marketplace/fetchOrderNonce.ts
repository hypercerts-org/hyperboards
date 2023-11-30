import { HYPERCERTS_MARKETPLACE_API_URL } from "@/config";

export const fetchOrderNonce = async ({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}) => {
  return fetch(`${HYPERCERTS_MARKETPLACE_API_URL}/marketplace/order-nonce`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      chainId,
    }),
  })
    .then(
      (res) =>
        res.json() as Promise<{
          data: { nonce_counter: number; address: string; chain_id: number };
        }>,
    )
    .then((res) => res.data);
};
