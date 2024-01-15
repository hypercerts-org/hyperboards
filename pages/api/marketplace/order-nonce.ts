import { NextApiRequest, NextApiResponse } from "next";
import { isAddress } from "viem";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/hypercerts-database";
import {
  // TODO: Is this a security risk?
  SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
  SUPABASE_HYPERCERTS_URL,
} from "@/config";
import NextCors from "nextjs-cors";

const inputSchemaGet = z
  .object({
    address: z.string({
      required_error: "Address is required",
      invalid_type_error: "Address must be a string",
    }),
    chainId: z.number({
      required_error: "Chain ID is required",
      invalid_type_error: "Chain ID must be a number",
    }),
  })
  .refine((data) => isAddress(data.address), {
    message: "Invalid address",
    path: ["address"],
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextCors(req, res, {
    // Options
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method !== "POST") {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }

  const parsedQuery = inputSchemaGet.safeParse(req.body);
  if (!parsedQuery.success) {
    res.status(400).json({
      success: false,
      message: parsedQuery.error.message,
      data: null,
    });
    return;
  }

  // Add to database
  const supabase = createClient<Database>(
    SUPABASE_HYPERCERTS_URL,
    SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
  );

  const { address, chainId } = parsedQuery.data;

  const lowerCaseAddress = address.toLowerCase();

  const { data: currentNonce, error: currentNonceError } = await supabase
    .from("marketplace-order-nonces")
    .select("*")
    .eq("address", lowerCaseAddress)
    .eq("chain_id", chainId)
    .maybeSingle();

  if (currentNonceError) {
    res.status(500).json({
      success: false,
      message: currentNonceError.message,
      data: null,
    });
    return;
  }

  if (!currentNonce) {
    const { data: newNonce } = await supabase
      .from("marketplace-order-nonces")
      .insert({
        address: lowerCaseAddress,
        chain_id: chainId,
        nonce_counter: 0,
      })
      .select("*")
      .single();

    res.status(200).json({
      success: true,
      message: "Success",
      data: newNonce,
    });
    return;
  }

  const { data: updatedNonce, error: updatedNonceError } = await supabase
    .from("marketplace-order-nonces")
    .update({
      nonce_counter: currentNonce.nonce_counter + 1,
    })
    .eq("address", lowerCaseAddress)
    .eq("chain_id", chainId)
    .select("*")
    .single();

  if (updatedNonceError) {
    res.status(500).json({
      success: false,
      message: updatedNonceError.message,
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Success",
    data: updatedNonce,
  });
}
