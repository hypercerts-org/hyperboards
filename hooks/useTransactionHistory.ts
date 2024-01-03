import { useQuery } from "@tanstack/react-query";
import { toHex } from "viem";

const START_BLOCK = 9898972;
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`;

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

export const useTransactionHistory = (address: string) => {
  return useQuery(
    ["transactionHistoryTo", address],
    async () => {
      return fetchHistoryToAddress(address);
    },
    {
      select: (data) => {
        const copiedData = [...data];
        copiedData.sort((a, b) => b.value - a.value);
        return copiedData;
      },
    },
  );
};
