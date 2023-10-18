import { useAccount, useSignMessage } from "wagmi";

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

export const fetchLogin = async (
  address: string,
  signed: string,
  nonce: string,
) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, signed, nonce }),
  });
  const result = await res.json();
  return result;
};

export const readableMessageToSign = "Sign in to Hypercerts";

const tokenName = "hyperboards-token";
const storeToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(tokenName, token);
};

export const getToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  return window.localStorage.getItem(tokenName);
};

export const useLogin = () => {
  const { address } = useAccount();
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
    }

    if (!signed) {
      throw new Error("Signed message not found");
    }

    try {
      const result = await fetchLogin(address, signed, nonce);
      console.log("Result", result);
      const token = result.token;
      storeToken(token);
    } catch (e) {
      console.error("Error logging in", e);
    }
  };
};
