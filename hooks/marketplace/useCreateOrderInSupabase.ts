import { useChainId, useMutation } from "wagmi";
import {
  QuoteType,
  Maker,
  HypercertExchangeClient,
} from "@hypercerts-org/marketplace-sdk";
import { Provider } from "ethers";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSigner";

export const useCreateOrderInSupabase = () => {
  const chainId = useChainId();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  return useMutation(
    async ({
      order,
      signature,
    }: {
      order: Maker;
      signer: string;
      signature: string;
      quoteType: QuoteType;
      // currency: string;
    }) => {
      if (!chainId) {
        throw new Error("No chainId");
      }

      if (!provider) {
        throw new Error("No provider");
      }

      if (!signer) {
        throw new Error("No signer");
      }

      const hypercertExchangeClient = new HypercertExchangeClient(
        chainId,
        // TODO: Fix typing issue with provider
        // @ts-ignore
        provider as unknown as Provider,
        // @ts-ignore
        signer,
      );

      return hypercertExchangeClient.registerOrder({
        order,
        signature,
      });
    },
  );
};
