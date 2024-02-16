import { useAccount, useBalance, useChainId, useChains } from "wagmi";
import { Flex, Text } from "@chakra-ui/react";

export const BalanceOverview = () => {
  const chainId = useChainId();
  const chains = useChains();
  const chain = chains.find((chain) => chain.id === chainId);
  const { address } = useAccount();
  const { data } = useBalance({
    chainId: chainId,
    address,
  });

  const balance = data?.formatted;

  return (
    <Flex
      backgroundColor={"background"}
      padding={2}
      paddingX={3}
      borderRadius={"8px"}
      fontSize={"md"}
      fontWeight={500}
    >
      <Text>{chain?.name}</Text>
      <Text ml={8} textStyle={"secondary"} fontWeight={600}>
        {balance?.slice(0, 6)} ETH
      </Text>
    </Flex>
  );
};
