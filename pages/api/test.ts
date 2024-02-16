import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/hypercerts-database";
import {
  SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
  SUPABASE_HYPERCERTS_URL,
} from "@/config";
import {
  addressesByNetwork,
  defaultMerkleTree,
  utils,
} from "@hypercerts-org/marketplace-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createClient<Database>(
    SUPABASE_HYPERCERTS_URL,
    SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
  );

  const { data } = await supabase
    .from("marketplace-orders")
    .select("*")
    .eq("id", "bacf94f4-7d57-473b-922b-9ac591d13819")
    .single();
  if (!data) {
    return;
  }

  console.log(addressesByNetwork[11155111]);

  const { signature, ...order } = data;
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");

  const validities = await utils.verifyMakerOrders(
    // @ts-ignore
    provider,
    "0x45cAE10e94d31F9d04f007faFd989d2Cf7193ba6",
    [order],
    [signature],
    [defaultMerkleTree],
  );

  const isValid = validities[0].every((x) => x === 0);

  return res.status(200).json({ isValid, validity: validities[0] });
}
