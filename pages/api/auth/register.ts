import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{} | { error: string }>,
) {
  const { address, nonce, signed, email } = req.body;
  const lowerCaseAddress = address.toLowerCase();

  // Handle inputs
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  if (!signed) {
    return res.status(400).json({ error: "Signed is required" });
  }

  if (!nonce) {
    return res.status(400).json({ error: "Nonce is required" });
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Create a new user with correct email.
  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email,
    user_metadata: { address: lowerCaseAddress },
    email_confirm: true,
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 5. insert response into public.users table with id with a new nonce
  const newNonce = Math.floor(Math.random() * 1000000);
  const { error: updateUserError } = await supabase
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

  if (updateUserError) {
    console.log("Error updating user", updateUserError);
    return res.status(500).json({ error: updateUserError.message });
  }

  return res.status(307).json({ redirectUrl: "/admin/hyperboards" });
}
