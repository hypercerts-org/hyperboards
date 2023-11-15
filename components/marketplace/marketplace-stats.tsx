import { Center, Flex, Spinner, Text } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";

const SellStat = ({
  amount,
  subText,
  unit,
}: {
  amount: number | string;
  unit?: string;
  subText?: string;
}) => {
  return (
    <Flex alignItems={"flex-end"}>
      <Text fontSize={"lg"} lineHeight={"1.7rem"}>
        {amount}
      </Text>
      {unit && <Text fontSize={"sm"}>&nbsp;{unit}</Text>}

      {subText && (
        <Text fontSize={"sm"} ml={1} opacity={0.4}>
          {subText}
        </Text>
      )}
    </Flex>
  );
};

export const MarketplaceStats = ({ hypercertId }: { hypercertId: string }) => {
  const { data: orders, isLoading } =
    useFetchMarketplaceOrdersForHypercert(hypercertId);

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!orders || orders.totalUnitsForSale === 0) {
    return (
      <Center>
        <Text>Not for sale</Text>
      </Center>
    );
  }

  return (
    <Flex justifyContent={"space-between"} width={"100%"}>
      <SellStat amount={orders.totalUnitsForSale} subText="units listed" />
      {orders.priceOfCheapestFraction !== undefined && (
        <SellStat
          amount={orders.priceOfCheapestFraction.toString()}
          unit="ETH"
          subText="/ unit"
        />
      )}
    </Flex>
  );
};
