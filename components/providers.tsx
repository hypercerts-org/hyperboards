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
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HypercertClient } from "@hypercerts-org/sdk";
import { InteractionDialogProvider } from "@/components/interaction-modal";
import Fonts from "@/fonts";
import { theme } from "@/theme";
import {
  ALCHEMY_KEY_GOERLI,
  EAS_CONTRACT_ADDRESS,
  NFT_STORAGE_TOKEN,
  WALLETCONNECT_ID,
  WEB3_STORAGE_TOKEN,
} from "@/config";
import {
  argentWallet,
  bitskiWallet,
  braveWallet,
  coinbaseWallet,
  dawnWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  mewWallet,
  okxWallet,
  omniWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  Valora,
  CeloWallet,
  CeloTerminal,
  MetaMask as CeloMetaMask,
} from "@celo/rainbowkit-celo/wallets";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli, optimism],
  [
    alchemyProvider({
      apiKey: ALCHEMY_KEY_GOERLI,
    }),
    publicProvider(),
  ],
);

const projectId = WALLETCONNECT_ID;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      argentWallet({ chains, projectId }),
      bitskiWallet({ chains }),
      braveWallet({ chains }),
      coinbaseWallet({ chains, appName: "Hypercerts" }),
      dawnWallet({ chains }),
      imTokenWallet({ chains, projectId }),
      ledgerWallet({ chains, projectId }),
      metaMaskWallet({ chains, projectId }),
      mewWallet({ chains }),
      okxWallet({ chains, projectId }),
      omniWallet({ chains, projectId }),
      phantomWallet({ chains }),
      rabbyWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      safeWallet({ chains }),
      tahoWallet({ chains }),
      trustWallet({ chains, projectId }),
      xdefiWallet({ chains }),
      zerionWallet({ chains, projectId }),
    ],
  },
  {
    groupName: "Recommended with CELO",
    wallets: [
      Valora({ chains, projectId }),
      CeloWallet({ chains, projectId }),
      CeloTerminal({ chains, projectId }),
      CeloMetaMask({ chains, projectId }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
  {
    groupName: "Injected",
    wallets: [injectedWallet({ chains })],
  },
]);

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
  const toast = useToast();

  const [client, setClient] = useState<HypercertClient>();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    if (!walletClient) {
      return;
    }

    try {
      const hypercertClient = new HypercertClient({
        chain: { id: chainId },
        nftStorageToken: NFT_STORAGE_TOKEN,
        web3StorageToken: WEB3_STORAGE_TOKEN,
        easContractAddress: EAS_CONTRACT_ADDRESS,
        // @ts-ignore
        walletClient,
      });

      setClient(hypercertClient);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not initialize client",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
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
