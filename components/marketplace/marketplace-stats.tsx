import { Center, Flex, Spinner, Text } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { useAddress } from "@/hooks/useAddress";

const SellStat = ({
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
      <SellStat
        amount={orders.totalPercentageForSale}
        unit="%"
        postfix="on sale"
      />
      {orders.priceOfCheapestFraction !== undefined && (
        <SellStat
          prefix="from"
          amount={orders.priceOfCheapestFraction.toPrecision(3).toString()}
          unit="ETH"
          postfix="/ %"
        />
      )}
    </Flex>
  );
};

export const OwnershipStats = ({ hypercertId }: { hypercertId: string }) => {
  const { data: fractions, isLoading } =
    useFetchHypercertFractionsByHypercertId(hypercertId);

  const address = useAddress();

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!fractions) {
    return (
      <Center>
        <Text>Not for sale</Text>
      </Center>
    );
  }

  const totalPercentageOwned = fractions
    .filter((x) => x.owner === address)
    .reduce((acc, x) => acc + x.percentage, 0);

  return (
    <Flex justifyContent={"space-between"} width={"100%"}>
      <SellStat amount={totalPercentageOwned} unit="%" postfix="on sale" />
      <SellStat
        prefix="from"
        amount={"Public display"}
        unit="ETH"
        postfix="/ %"
      />
    </Flex>
  );
};
