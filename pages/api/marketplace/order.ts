import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
  SUPABASE_HYPERCERTS_URL,
} from "@/config";

import { z } from "zod";
import { OrderStatus } from "@/types/api";
import { verifyTypedData } from "ethers";
import { Database } from "@/types/hypercerts-database";
import NextCors from "nextjs-cors";
import { deployments, asDeployedChain } from "@hypercerts-org/contracts";

const inputSchemaPost = z.object({
  signature: z.string(),
  chainId: z.number(),
  quoteType: z.number(),
  globalNonce: z.string(),
  subsetNonce: z.number(),
  orderNonce: z.string(),
  strategyId: z.number(),
  collectionType: z.number(),
  collection: z.string(),
  currency: z.string(),
  signer: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  price: z.string(),
  itemIds: z.array(z.string()),
  amounts: z.array(z.number()),
  additionalParameters: z.string(),
});

const getTypedData = (chainId: number) => {
  const verifyingContract =
    deployments[asDeployedChain(chainId)].HypercertExchange;

  if (!verifyingContract) {
    throw new Error(
      `Unknown address for HypercertExchange on chain with id ${chainId}`,
    );
  }

  console.log("verifyingContract", verifyingContract);

  return {
    name: "LooksRareProtocol",
    version: "2",
    chainId,
    verifyingContract,
  };
};

export const makerTypes = {
  Maker: [
    { name: "quoteType", type: "uint8" },
    { name: "globalNonce", type: "uint256" },
    { name: "subsetNonce", type: "uint256" },
    { name: "orderNonce", type: "uint256" },
    { name: "strategyId", type: "uint256" },
    { name: "collectionType", type: "uint8" },
    { name: "collection", type: "address" },
    { name: "currency", type: "address" },
    { name: "signer", type: "address" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "price", type: "uint256" },
    { name: "itemIds", type: "uint256[]" },
    { name: "amounts", type: "uint256[]" },
    { name: "additionalParameters", type: "bytes" },
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    success: boolean;
    message: string;
    data: null | {
      id: string;
      hash: string;
      createdAt: string;
      status: OrderStatus;
      quoteType: number;
      globalNonce: string;
      subsetNonce: number;
      orderNonce: string;
      strategyId: number;
      collectionType: number;
      collection: string;
      currency: string;
      signer: string;
      startTime: number;
      endTime: number;
      price: string;
      itemIds: string[];
      amounts: number[];
      additionalParameters: string;
      chainId: number;
      signature: string;
    };
  }>,
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "POST") {
    // Validate inputs
    console.log(req.body);
    const parsedBody = inputSchemaPost.safeParse(req.body);
    if (!parsedBody.success) {
      console.error(parsedBody.error);
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        data: null,
      });
    }
    const { signature, chainId, ...makerOrder } = parsedBody.data;

    console.log("[marketplace-api] Verifying signature", makerTypes, signature);
    const recoveredAddress = verifyTypedData(
      getTypedData(chainId),
      makerTypes,
      makerOrder,
      signature,
    );
    console.log("[marketplace-api] Signature verified", recoveredAddress);

    if (!(recoveredAddress.toLowerCase() === makerOrder.signer.toLowerCase())) {
      return res
        .status(401)
        .json({ message: "Invalid signature", success: false, data: null });
    }

    // Add to database
    const supabase = createClient<Database>(
      SUPABASE_HYPERCERTS_URL,
      SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
    );
    const insertEntity = {
      ...makerOrder,
      chainId,
      signature,
    };
    console.log("[marketplace-api] Inserting order entity", insertEntity);
    try {
      const resultRow = await supabase
        .from("marketplace-orders")
        .insert([insertEntity])
        .select("*")
        .single()
        .throwOnError();

      res.status(200).json({
        message: "Added to database",
        success: true,
        data: resultRow.data
          ? {
              ...resultRow.data,
              itemIds: resultRow.data.itemIds as string[],
              amounts: resultRow.data.amounts as number[],
              status: "VALID",
              hash: "0x",
            }
          : null,
      });
    } catch (error) {
      console.error(error);
      if (error) {
        return res.status(500).json({
          message: "Could not add to database",
          success: false,
          data: null,
        });
      }
    }
  }
}
