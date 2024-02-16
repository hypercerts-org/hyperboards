import { useChainId, useReadContract } from "wagmi";
import {
  WETHAbi,
  addressesByNetwork,
  utils,
} from "@hypercerts-org/marketplace-sdk";
import { useAddress } from "@/hooks/useAddress";
import { asDeployedChain, deployments } from "@hypercerts-org/contracts";

export const useGetCurrentERC20Allowance = () => {
  const chainId = useChainId();
  const address = useAddress();
  const hypercertsExchangeAddress =
    deployments[asDeployedChain(chainId)].HypercertExchange;
  const wethAddress = addressesByNetwork[utils.asDeployedChain(chainId)].WETH;
  const { data } = useReadContract({
    abi: WETHAbi,
    address: wethAddress as `0x${string}`,
    chainId,
    functionName: "allowance",
    // enabled: !!chainId && !!address && !!hypercertsExchangeAddress,
    args: [address, hypercertsExchangeAddress],
  });

  return (data || 0n) as bigint;
};
