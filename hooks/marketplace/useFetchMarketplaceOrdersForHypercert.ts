import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { useQuery } from "@tanstack/react-query";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import _ from "lodash";
import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { Provider } from "ethers";

export const useFetchMarketplaceOrdersForHypercert = (hypercertId: string) => {
  const { data: fractions } =
    useFetchHypercertFractionsByHypercertId(hypercertId);

  const chainId = useChainId();
  const provider = useEthersProvider();

  return useQuery(
    ["available-orders", hypercertId],
    async () => {
      if (!fractions) {
        throw new Error("No fractions");
      }

      if (!chainId) {
        throw new Error("No chainId");
      }

      const hypercertExchangeClient = new HypercertExchangeClient(
        chainId,
        // TODO: Fix typing issue with provider
        // @ts-ignore
        provider as unknown as Provider,
      );

      const { data: orders } =
        await hypercertExchangeClient.api.fetchOrdersByHypercertId({
          hypercertId,
          chainId,
        });

      if (!orders) {
        throw new Error("No orders");
      }

      const allFractionIdsForSale = orders.map((order) => order.itemIds).flat();
      const allFractionsForSale = fractions.filter((fraction) =>
        allFractionIdsForSale.includes(fraction.tokenID),
      );

      const totalUnitsForSale = allFractionsForSale.reduce(
        (acc, fraction) => acc + BigInt(fraction.units),
        0n,
      );

      const totalPercentageForSale = allFractionsForSale.reduce(
        (acc, fraction) => acc + fraction.percentage,
        0,
      );

      const ordersByFractionId = _.keyBy(orders, (order) => order.itemIds?.[0]);
      const ordersWithAveragePrice = _.mapValues(
        ordersByFractionId,
        (order) => {
          const fractionId = order.itemIds[0];
          const fraction = allFractionsForSale.find(
            (fraction) => fraction.tokenID === fractionId,
          );
          const priceInEther = formatEther(BigInt(order.price));
          const units = fraction?.units || 1;
          const averagePrice = Number(priceInEther) / units;
          const pricePerPercent =
            (BigInt(order.price) * 10n ** 4n) /
            BigInt(fraction?.percentage || 1) /
            10n ** 4n;
          return { order, averagePrice, fraction, pricePerPercent };
        },
      );
      const cheapestFraction = _.minBy(
        _.values(ordersWithAveragePrice),
        (order) => order.averagePrice,
      );

      return {
        orders: ordersWithAveragePrice,
        totalUnitsForSale: totalUnitsForSale,
        totalPercentageForSale,
        priceOfCheapestFraction: cheapestFraction?.averagePrice,
      };
    },
    {
      enabled: !!fractions,
    },
  );
};
