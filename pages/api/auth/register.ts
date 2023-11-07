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

  // Check if user for email exists
  const { data: users, error: userError } =
    await supabase.auth.admin.listUsers();
  const userForEmail = users?.users.find((user) => user.email === email);

  if (userError) {
    return res.status(500).json({ error: userError.message });
  }

  const newNonce = Math.floor(Math.random() * 1000000);
  let userId: string | undefined;
  if (userForEmail) {
    userId = userForEmail.id;
  } else {
    // Create a new user with correct email.
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email,
      user_metadata: { address: lowerCaseAddress },
      email_confirm: true,
    });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    userId = authUser?.user.id;
  }

  if (!userId) {
    return res.status(500).json({ error: "User not found or created" });
  }

  // 5. insert response into public.users table with id with a new nonce
  const { error: updateUserError } = await supabase
    .from("users")
    .update({
      auth: {
        genNonce: newNonce, // update the nonce, so it can't be reused
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "success",
      },
      id: userId,
    })
    .eq("address", lowerCaseAddress); // primary key

  if (updateUserError) {
    console.log("Error updating user", updateUserError);
    return res.status(500).json({ error: updateUserError.message });
  }

  return res.status(307).json({ redirectUrl: "/admin/hyperboards" });
}
