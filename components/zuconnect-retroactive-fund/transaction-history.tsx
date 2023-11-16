import { useFetchTransactionHistory } from "@/hooks/useFetchTransactionHistory";
import React from "react";
import {
  Text,
  Flex,
  Heading,
  Spinner,
  VStack,
  Divider,
  Center,
} from "@chakra-ui/react";
import { useEnsName } from "wagmi";
import { formatAddress } from "@/utils/formatting";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ZUZALU_DONATION_SAFE_ADDRESS } from "@/config";

export const TransactionHistory = () => {
  const { data, isLoading } = useFetchTransactionHistory(
    ZUZALU_DONATION_SAFE_ADDRESS,
  );
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Center>
        <Spinner color="#41645F" />
      </Center>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <VStack spacing={6} px={isMobile ? 2 : 0}>
      <Heading textTransform={"uppercase"} textAlign={"center"} width={"100%"}>
        Contributors
      </Heading>
      <Flex justifyContent={"space-between"} width={"100%"}>
        <Text fontWeight={600}>Contributor</Text>
        <Text fontWeight={600}>ETH</Text>
      </Flex>
      <VStack
        divider={<Divider color={"#C3C3C3"} size={"md"} m={"0px !important"} />}
        spacing={4}
        alignItems={"flex-start"}
        w={"100%"}
      >
        {data.map((transaction) => (
          <TransactionRow
            key={transaction.hash}
            value={transaction.value}
            from={transaction.from}
            txHash={transaction.hash}
          />
        ))}
      </VStack>
    </VStack>
  );
};

const TransactionRow = ({
  value,
  from,
  txHash,
}: {
  value: number;
  from: `0x${string}`;
  txHash: string;
}) => {
  const { data, isFetched } = useEnsName({
    address: from,
  });

  if (!isFetched) {
    return null;
  }

  return (
    <a
      href={`https://etherscan.io/tx/${txHash}`}
      target={"_blank"}
      style={{ width: "100%" }}
    >
      <Flex
        width={"100%"}
        justifyContent={"space-between"}
        py={4}
        _hover={{ bg: "#e3e1e1" }}
        cursor={"pointer"}
      >
        <Text m={0} fontSize={"md"}>
          {data || formatAddress(from)}
        </Text>
        <Text m={0} fontSize={"md"}>
          {value}
        </Text>
      </Flex>
    </a>
  );
};
