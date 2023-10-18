import { useAccount, useSignMessage } from "wagmi";
import { getSupabaseAuthenticatedClient } from "@/lib/supabase";
import { useToast } from "@chakra-ui/react";

const fetchNonce = async (address: string) => {
  const res = await fetch("/api/auth/nonce", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });
  const { nonce } = await res.json();
  return nonce;
};

const fetchLogin = async (address: string, signed: string, nonce: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, signed, nonce }),
  });
  return await res.json();
};

export const readableMessageToSign = "Sign in to Hypercerts";

export const useGetAuthenticatedClient = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { signMessageAsync } = useSignMessage({
    onSuccess: (signature) => {
      console.log("Signature: ", signature);
    },
  });

  return async () => {
    if (!address) {
      throw new Error("No address found");
    }

    let nonce: string | undefined;

    try {
      nonce = await fetchNonce(address);
    } catch (e) {
      console.error("Error requesting nonce", e);
      toast({
        title: "Authentication failed",
        status: "error",
      });
      return;
    }

    if (!nonce) {
      throw new Error("Nonce not found");
    }

    let signed: string | undefined;

    try {
      signed = await signMessageAsync({
        message: readableMessageToSign,
      });
    } catch (e) {
      console.error("Error signing message", e);
      toast({
        title: "Authentication failed",
        description: "Please sign message",
        status: "error",
      });
      return;
    }

    if (!signed) {
      throw new Error("Signed message not found");
    }

    let token: string | undefined;
    try {
      const result = await fetchLogin(address, signed, nonce!);
      console.log("Result", result);
      token = result.token;
    } catch (e) {
      console.error("Error logging in", e);
      toast({
        title: "Authentication failed",
        status: "error",
      });
      return;
    }

    if (!token) {
      throw new Error("Token not found");
    }

    return getSupabaseAuthenticatedClient(token);
  };
};
