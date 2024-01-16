import { Flex, Text } from "@chakra-ui/react";

export const HorizontalMarketplaceStatistic = ({
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
    <Flex alignItems={"flex-end"}>
      {prefix && (
        <Text fontSize={"18px"} mr={1} opacity={0.4}>
          {prefix}
        </Text>
      )}
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
  );
};
