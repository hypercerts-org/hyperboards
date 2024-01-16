import { Flex, Text, VStack } from "@chakra-ui/react";

export const VerticalMarketplaceStatistic = ({
  amount,
  prefix,
  postfix,
  unit,
}: {
  amount: number | string;
  unit?: string;
  prefix?: string;
  postfix?: string;
}) => {
  return (
    <VStack alignItems={"flex-start"} spacing={0}>
      {prefix && (
        <Text fontSize={"18px"} mr={1} opacity={0.4}>
          {prefix}
        </Text>
      )}
      <Flex>
        <Text fontSize={"xl"} lineHeight={"2.1rem"}>
          {amount}
        </Text>
        {unit && (
          <Text ml={0.5} fontSize={"18px"}>
            {unit}
          </Text>
        )}
        {postfix && (
          <Text fontSize={"18px"} ml={1} opacity={0.4}>
            {postfix}
          </Text>
        )}
      </Flex>
    </VStack>
  );
};
