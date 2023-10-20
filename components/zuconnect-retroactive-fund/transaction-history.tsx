import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import React from "react";
import {
  Text,
  Flex,
  Heading,
  Spinner,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useEnsName } from "wagmi";
import { formatAddress } from "@/utils/formatting";
import { SAFE_ADDRESS } from "@/components/zuconnect-retroactive-fund/donation-form";

export const TransactionHistory = () => {
  const { data } = useTransactionHistory(SAFE_ADDRESS);

  if (!data) {
    return <Spinner color="#41645F" />;
  }

  return (
    <VStack spacing={6}>
      <Heading textTransform={"uppercase"} textAlign={"center"} width={"100%"}>
        Contributors
      </Heading>
      <Flex justifyContent={"space-between"} width={"100%"}>
        <Text fontWeight={600} fontSize={"lg"}>
          Contributor
        </Text>
        <Text fontWeight={600} fontSize={"lg"}>
          ETH
        </Text>
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
