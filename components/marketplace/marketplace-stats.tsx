import { Center, Flex, Spinner, Text } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import { HorizontalMarketplaceStatistic } from "@/components/marketplace/horizontal-marketplace-statistic";

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

  if (!orders || orders.totalUnitsForSale === 0n) {
    return (
      <Center>
        <Text>Not for sale</Text>
      </Center>
    );
  }

  return (
    <Flex justifyContent={"space-between"} width={"100%"}>
      <HorizontalMarketplaceStatistic
        amount={orders.totalPercentageForSale}
        unit="%"
        postfix="on sale"
      />
      {orders.priceOfCheapestFraction !== undefined && (
        <HorizontalMarketplaceStatistic
          prefix="from"
          amount={orders.priceOfCheapestFraction.toPrecision(3).toString()}
          unit="ETH"
          postfix="/ %"
        />
      )}
    </Flex>
  );
};
