import { useChainId, useWalletClient } from "wagmi";
import {
  WETHAbi,
  addressesByNetwork,
  utils,
} from "@hypercerts-org/marketplace-sdk";
import { useAddress } from "@/hooks/useAddress";
import { readContract } from "viem/actions";

export const useGetCurrentERC20Allowance = () => {
  const chainId = useChainId();
  const address = useAddress();
  const hypercertsExchangeAddress =
    addressesByNetwork[utils.asDeployedChain(chainId)].EXCHANGE_V2;

  console.log("checking for", hypercertsExchangeAddress);

  const { data: walletClient } = useWalletClient();

  return async (currency: `0x${string}`) => {
    if (!walletClient) {
      return 0n;
    }

    const data = await readContract(walletClient, {
      abi: WETHAbi,
      address: currency as `0x${string}`,
      functionName: "allowance",
      args: [address, hypercertsExchangeAddress],
    });

    return data as bigint;
  };
};
