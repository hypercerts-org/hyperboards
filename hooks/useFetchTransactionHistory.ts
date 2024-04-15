import { useQuery } from "@tanstack/react-query";
import { toHex } from "viem";
import { ALCHEMY_KEY } from "@/config";
import _ from "lodash";

const START_BLOCK = 9898972;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`;

const fetchHistoryToAddress = (address: string) =>
  fetch(baseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          category: ["external"],
          fromBlock: toHex(START_BLOCK),
          toAddress: address,
        },
      ],
    }),
    redirect: "follow",
  })
    .then((res) => {
      return res.json() as Promise<{
        result: {
          transfers: {
            value: number;
            from: `0x${string}`;
            hash: string;
          }[];
        };
      }>;
    })
    .then((res) => res.result.transfers);

export const useFetchTransactionHistory = (address: string) => {
  return useQuery({
    queryKey: ["transactionHistoryTo", address],
    queryFn: async () => {
      return fetchHistoryToAddress(address);
    },
    select: (data) => {
      return _.chain(data)
        .groupBy((x) => x.from)
        .map((txs, from) => ({
          from,
          value: _.sumBy(txs, (tx) => tx.value),
        }))
        .sortBy("value")
        .reverse()
        .value();
    },
  });
};
