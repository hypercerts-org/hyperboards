// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { readableMessageToSign } from "@/hooks/useGetAuthenticatedClient";
import { verifyMessage } from "ethers";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import jwt from "jsonwebtoken";

type Data =
  | {
      token: string;
    }
  | {
      redirectUrl: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>,
) {
  /*
    1. verify the signed message matches the requested address
    2. select * from public.user table where address matches
    3. verify the nonce included in the request matches what's
    already in public.users table for that address
    4. if there's no public.users.id for that address, then you
    need to create a user in the auth.users table
  */

  const { address, nonce, signed } = req.body;

  const lowerCaseAddress = address.toLowerCase();

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 1. verify the signed message matches the requested address
  const recoveredAddress = verifyMessage(readableMessageToSign, signed);

  if (
    !recoveredAddress ||
    recoveredAddress.toLowerCase() !== lowerCaseAddress
  ) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // 2. select * from public.user table where address matches
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("address", lowerCaseAddress)
    .single();

  const JWT = process.env.NEXT_PUBLIC_JWT_SECRET;

  if (!JWT) {
    console.error("JWT not set");
    return res.status(500).json({ error: "JWT not set" });
  }

  // Guest user, just use jwt to sign address
  if (!user) {
    const token = jwt.sign(
      {
        address: lowerCaseAddress, // this will be read by RLS policy
      },
      JWT,
      { expiresIn: 60 * 2 },
    );
    return res.status(200).send({ token });
  }

  // 3. verify the nonce included in the request matches what's
  // already in public.users table for that address
  // @ts-ignore
  const userNonce = user.auth?.genNonce;
  if (userNonce !== nonce) {
    return res.status(401).json({ error: "Invalid nonce" });
  }

  let userId = user.id;

  // 4. if there's no public.users.id for that address, then you
  // need to create a user in the auth.users table
  const newNonce = Math.floor(Math.random() * 1000000);
  if (!user.id) {
    return res.status(307).json({ redirectUrl: "/register" });
  } else {
    // Otherwise just update the nonce
    await supabase
      .from("users")
      .update({
        auth: {
          genNonce: newNonce, // update the nonce, so it can't be reused
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "success",
        },
      })
      .eq("address", lowerCaseAddress); // primary key
  }

  const token = jwt.sign(
    {
      address: lowerCaseAddress, // this will be read by RLS policy
      sub: userId,
      aud: "authenticated",
      role: "authenticated",
    },
    JWT,
    { expiresIn: 60 * 2 },
  );

  return res.status(200).send({ token });
}
