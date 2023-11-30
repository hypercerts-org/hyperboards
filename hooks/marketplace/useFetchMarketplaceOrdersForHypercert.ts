import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { useQuery } from "@tanstack/react-query";
import { supabaseHypercerts } from "@/lib/supabase";
import _ from "lodash";
import { formatEther } from "viem";

export const useFetchMarketplaceOrdersForHypercert = (hypercertId: string) => {
  const { data: fractions } =
    useFetchHypercertFractionsByHypercertId(hypercertId);

  return useQuery(
    ["available-orders", hypercertId],
    async () => {
      if (!fractions) {
        throw new Error("No fractions");
      }

      const tokenIds = fractions.map((fraction) => fraction.tokenID);
      const { data: orders } = await supabaseHypercerts
        .from("marketplace-orders")
        .select("*")
        .containedBy("itemIds", tokenIds)
        .throwOnError();

      if (!orders) {
        throw new Error("No orders");
      }

      const allFractionIdsForSale = orders.map((order) => order.itemIds).flat();
      const allFractionsForSale = fractions.filter((fraction) =>
        allFractionIdsForSale.includes(fraction.tokenID),
      );

      const totalUnitsForSale = _.sumBy(
        allFractionsForSale,
        (fraction) => fraction.units,
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
          return { order, averagePrice, fraction };
        },
      );
      const cheapestFraction = _.minBy(
        _.values(ordersWithAveragePrice),
        (order) => order.averagePrice,
      );

      return {
        orders: ordersWithAveragePrice,
        totalUnitsForSale,
        priceOfCheapestFraction: cheapestFraction?.averagePrice,
      };
    },
    {
      enabled: !!fractions,
    },
  );
};
