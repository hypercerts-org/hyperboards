import { utils } from "@hypercerts-org/marketplace-sdk";

export const fetchOrderNonce = async ({
  address,
  chainId,
}: {
  address: string;
  chainId: number;
}) => {
  return utils.api.fetchOrderNonce({
    address,
    chainId,
  });
};
