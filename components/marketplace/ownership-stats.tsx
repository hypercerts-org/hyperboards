import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { useAddress } from "@/hooks/useAddress";
import { Center, Flex, Spinner, Text } from "@chakra-ui/react";
import { VerticalMarketplaceStatistic } from "@/components/marketplace/vertical-marketplace-statistic";

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
    <Flex width={"100%"}>
      <Flex flexBasis={"50%"}>
        <VerticalMarketplaceStatistic
          amount={totalPercentageOwned}
          unit="%"
          prefix="You own"
        />
      </Flex>
      <Flex flexBasis={"50%"}>
        <VerticalMarketplaceStatistic
          prefix="Your usage rights"
          amount={"Public display"}
        />
      </Flex>
    </Flex>
  );
};
