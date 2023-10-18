// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

type Data = {
  nonce: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>,
) {
  const { address } = req.body;
  const nonce = Math.floor(Math.random() * 1000000);

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase.from("users").upsert({
    address: address.toLowerCase(),
    auth: {
      genNonce: nonce,
      lastAuth: new Date().toISOString(),
      lastAuthStatus: "pending",
    },
  });

  if (error) {
    console.log("Error updating nonce", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ nonce });
}
