import { Flex, Text } from "@chakra-ui/react";

const SellStat = ({
  amount,
  subText,
  unit,
}: {
  amount: number;
  unit: string;
  subText: string;
}) => {
  return (
    <Flex alignItems={"flex-end"}>
      <Text fontSize={"lg"} lineHeight={"1.7rem"}>
        {amount}
      </Text>
      <Text fontSize={"sm"}>&nbsp;{unit}</Text>
      <Text fontSize={"sm"} opacity={0.4}>
        &nbsp;/&nbsp;
      </Text>
      <Text fontSize={"sm"} opacity={0.4}>
        {subText}
      </Text>
    </Flex>
  );
};

export const MarketplaceStats = ({}: { hypercertId: string }) => {
  // TODO: Wire this up
  const unitsForSale = 10;
  const unitsListed = 100;
  const pricePerUnit = 0.25;
  return (
    <Flex justifyContent={"space-between"} width={"100%"}>
      <SellStat
        amount={unitsForSale}
        unit="units"
        subText={`${unitsListed} listed`}
      />
      <SellStat amount={pricePerUnit} unit="ETH" subText="unit" />
    </Flex>
  );
};
