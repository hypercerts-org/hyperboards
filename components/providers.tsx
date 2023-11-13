import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  configureChains,
  createConfig,
  useChainId,
  useWalletClient,
  WagmiConfig,
} from "wagmi";
import { goerli, optimism } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HypercertClient } from "@hypercerts-org/sdk";
import { InteractionDialogProvider } from "@/components/interaction-modal";
import Fonts from "@/fonts";
import { theme } from "@/theme";
import {
  ALCHEMY_KEY_GOERLI,
  NFT_STORAGE_TOKEN,
  WALLETCONNECT_ID,
  WEB3_STORAGE_TOKEN,
} from "@/config";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli, optimism],
  [
    alchemyProvider({
      apiKey: ALCHEMY_KEY_GOERLI,
    }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "Hyperboards",
  projectId: WALLETCONNECT_ID,
  chains,
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

export const Providers = ({
  showReactQueryDevtools = true,
  children,
}: PropsWithChildren<{ showReactQueryDevtools?: boolean }>) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <HypercertClientProvider>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <Fonts />
              <InteractionDialogProvider>{children}</InteractionDialogProvider>
            </ChakraProvider>
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

    if (!chainId) {
      return;
    }

    if (!walletClient) {
      return;
    }

    const hypercertClient = new HypercertClient({
      chain: { id: chainId },
      nftStorageToken: NFT_STORAGE_TOKEN,
      web3StorageToken: WEB3_STORAGE_TOKEN,
      walletClient,
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
  return React.useContext(HypercertClientContext);
};
