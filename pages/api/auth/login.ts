// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { readableMessageToSign } from "@/hooks/useGetAuthenticatedClient";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import jwt from "jsonwebtoken";

type Data = {
  token: string;
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
  const recoveredAddress = ethers.utils.verifyMessage(
    readableMessageToSign,
    signed,
  );

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

  if (error) {
    console.log("Error selecting user", error);
    return res.status(500).json({ error: error.message });
  }

  if (!user) {
    return res.status(500).json({ error: "User not found" });
  }

  // 3. verify the nonce included in the request matches what's
  // already in public.users table for that address
  const userNonce = user.auth.genNonce;
  if (userNonce !== nonce) {
    return res.status(401).json({ error: "Invalid nonce" });
  }

  let userId = user.id;

  // 4. if there's no public.users.id for that address, then you
  // need to create a user in the auth.users table
  const newNonce = Math.floor(Math.random() * 1000000);
  if (!user.id) {
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email: "info@jips.dev",
      user_metadata: { address: lowerCaseAddress },
      email_confirm: true,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // 5. insert response into public.users table with id
    await supabase
      .from("users")
      .update({
        auth: {
          genNonce: newNonce, // update the nonce, so it can't be reused
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "success",
        },
        id: authUser.user.id,
      })
      .eq("address", lowerCaseAddress); // primary key
    userId = authUser.user.id;
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
  // 6. lastly, we sign the token, then return it to client
  const JWT = process.env.NEXT_PUBLIC_JWT_SECRET;

  if (!JWT) {
    console.error("JWT not set");
    return res.status(500).json({ error: "JWT not set" });
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
