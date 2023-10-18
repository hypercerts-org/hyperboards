import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  configureChains,
  createConfig,
  useChainId,
  useWalletClient,
  WagmiConfig,
  WalletClient,
} from "wagmi";
import { goerli } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HypercertClient } from "@hypercerts-org/sdk";
import { providers } from "ethers";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY_GOERLI!,
    }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "Hyperboards",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains,
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});
const queryClient = new QueryClient();

export const Providers = ({
  showReactQueryDevtools = true,
  children,
}: PropsWithChildren<{ showReactQueryDevtools?: boolean }>) => {
  const [client] = useState(() => {
    return new HypercertClient({
      chainId: 5,
      nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN!,
    });
  });

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <HypercertClientProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider>{children}</ChakraProvider>
            {showReactQueryDevtools && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </HypercertClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

const HypercertClientContext = React.createContext<HypercertClient | undefined>(
  undefined,
);

export const HypercertClientProvider = ({ children }: PropsWithChildren) => {
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const [client, setClient] = useState<HypercertClient>();

  useEffect(() => {
    console.log("creating hypercert client", chainId, walletClient);

    const walletClientToSigner = (walletClient: WalletClient) => {
      const { account, chain, transport } = walletClient;
      const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      };
      const provider = new providers.Web3Provider(transport, network);
      const signer = provider.getSigner(account.address);
      console.log("signer", signer);
      return signer;
    };

    const operator = walletClient
      ? walletClientToSigner(walletClient)
      : undefined;

    const hypercertClient = new HypercertClient({
      chainId,
      nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN!,
      operator,
    });

    setClient(hypercertClient);
  }, [chainId, walletClient]);

  return (
    <HypercertClientContext.Provider value={client}>
      {children}
    </HypercertClientContext.Provider>
  );
};

export const useHypercertClient = () => {
  const client = React.useContext(HypercertClientContext);

  return client;
};
