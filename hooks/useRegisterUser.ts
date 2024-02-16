import { useAddress } from "@/hooks/useAddress";
import { useSignMessage } from "wagmi";
import {
  fetchAuthNonce,
  readableMessageToSign,
} from "@/hooks/useGetAuthenticatedClient";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

const fetchRegister = async (
  address: string,
  email: string,
  signed: string,
  nonce: string,
) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, email, signed, nonce }),
  });
  return await res.json();
};

export const useRegisterUser = () => {
  const address = useAddress();
  const toast = useToast();
  const { signMessageAsync } = useSignMessage({});

  return useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async (email: string) => {
      if (!address) {
        throw new Error("No address found");
      }

      let nonce: string | undefined;

      try {
        nonce = await fetchAuthNonce(address);
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
          title: "Signing failed",
          description: "Please sign message",
          status: "error",
        });
        return;
      }

      try {
        return await fetchRegister(address, email, signed, nonce);
      } catch (e) {
        console.error("Error registering", e);
        toast({
          title: "Registration failed",
          status: "error",
        });
        return;
      }
    },
  });
};
