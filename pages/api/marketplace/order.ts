import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import {
  EAS_CONTRACT_ADDRESS,
  NFT_STORAGE_TOKEN,
  SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
  SUPABASE_HYPERCERTS_URL,
} from "@/config";

import { z } from "zod";
import { OrderStatus } from "@/types/api";
import { ethers, verifyTypedData } from "ethers";
import { Database } from "@/types/hypercerts-database";
import NextCors from "nextjs-cors";
import {
  HypercertExchangeClient,
  utils,
} from "@hypercerts-org/marketplace-sdk";
import { ClaimTokenByIdQuery, HypercertClient } from "@hypercerts-org/sdk";

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

    const hec = new HypercertExchangeClient(
      chainId,
      // @ts-ignore
      new ethers.JsonRpcProvider(),
    );
    const typedData = hec.getTypedDataDomain();

    console.log("[marketplace-api] Verifying signature");
    console.log("[marketplace-api] Chain ID", chainId);
    console.log("[marketplace-api] Maker Order", makerOrder);
    console.log("[marketplace-api] Signature", signature);
    console.log("[marketplace-api] Maker Types", utils.makerTypes);
    console.log("[marketplace-api] typed data", typedData);

    const recoveredAddress = verifyTypedData(
      typedData,
      utils.makerTypes,
      makerOrder,
      signature,
    );
    console.log("[marketplace-api] Recovered address", recoveredAddress);

    if (!(recoveredAddress.toLowerCase() === makerOrder.signer.toLowerCase())) {
      return res.status(401).json({
        message: "Recovered address is not equal to signer of order",
        success: false,
        data: null,
      });
    }

    const hypercertClient = new HypercertClient({
      chain: { id: chainId },
      nftStorageToken: NFT_STORAGE_TOKEN,
      easContractAddress: EAS_CONTRACT_ADDRESS,
      indexerEnvironment: "all",
    });
    const tokenIds = makerOrder.itemIds.map(
      (id) => `${chainId}-${makerOrder.collection.toLowerCase()}-${id}`,
    );
    console.log("[marketplace-api] Token IDs", tokenIds);

    const claimTokens = await Promise.all(
      tokenIds.map(
        (id) => hypercertClient.indexer.fractionById(id) as ClaimTokenByIdQuery,
      ),
    );
    console.log("[marketplace-api] Claim tokens", claimTokens);

    // Check if all fractions exist
    if (claimTokens.some((claimToken) => !claimToken.claimToken)) {
      return res.status(401).json({
        message: "Not all fractions in itemIds exist",
        success: false,
        data: null,
      });
    }

    // Check if all fractions are owned by signer
    if (
      !claimTokens.every(
        (claimToken) =>
          claimToken.claimToken?.owner.toLowerCase() ===
          recoveredAddress.toLowerCase(),
      )
    ) {
      return res.status(401).json({
        message: "Not all fractions are owned by signer",
        success: false,
        data: null,
      });
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
