import { HypercertClient } from "@hypercerts-org/sdk";

export const client = new HypercertClient({
  chainId: 5,
  nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN!,
});
