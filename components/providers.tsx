import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  useChainId,
  usePublicClient,
  useWalletClient,
  WagmiProvider,
} from "wagmi";
import { sepolia, optimism } from "viem/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HypercertClient } from "@hypercerts-org/sdk";
import { InteractionDialogProvider } from "@/components/interaction-modal";
import Fonts from "@/fonts";
import { index } from "@/theme";
import {
  EAS_CONTRACT_ADDRESS,
  NFT_STORAGE_TOKEN,
  WALLETCONNECT_ID,
  WEB3_STORAGE_TOKEN,
} from "@/config";
// import {
//   argentWallet,
//   bitskiWallet,
//   braveWallet,
//   coinbaseWallet,
//   dawnWallet,
//   imTokenWallet,
//   injectedWallet,
//   ledgerWallet,
//   metaMaskWallet,
//   mewWallet,
//   okxWallet,
//   omniWallet,
//   phantomWallet,
//   rabbyWallet,
//   rainbowWallet,
//   safeWallet,
//   tahoWallet,
//   trustWallet,
//   walletConnectWallet,
//   xdefiWallet,
//   zerionWallet,
// } from "@rainbow-me/rainbowkit/wallets";
// import {
//   Valora,
//   CeloWallet,
//   CeloTerminal,
//   MetaMask as CeloMetaMask,
// } from "@celo/rainbowkit-celo/wallets";
//
// const { chains, publicClient, webSocketPublicClient } = createConfig(
//   [sepolia, optimism],
//   [
//     alchemyProvider({
//       apiKey: ALCHEMY_KEY,
//     }),
//     publicProvider(),
//   ],
// );

const projectId = WALLETCONNECT_ID;

const config = getDefaultConfig({
  projectId,
  appName: "Hyperboards",
  chains: [sepolia, optimism],
  ssr: true,
});

// const config = getDefaultConfig({
//   appName: "RainbowKit App",
//   projectId: "YOUR_PROJECT_ID",
//   chains: [optimism, sepolia],
//   ssr: true,
// });

const queryClient = new QueryClient();

export const Providers = ({
  showReactQueryDevtools = true,
  children,
}: PropsWithChildren<{ showReactQueryDevtools?: boolean }>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HypercertClientProvider>
            <ChakraProvider theme={index}>
              <Fonts />
              <InteractionDialogProvider>{children}</InteractionDialogProvider>
            </ChakraProvider>
            {showReactQueryDevtools && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </HypercertClientProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const HypercertClientContext = React.createContext<HypercertClient | undefined>(
  undefined,
);

export const HypercertClientProvider = ({ children }: PropsWithChildren) => {
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({});
  const publicClient = usePublicClient({});

  const [client, setClient] = useState<HypercertClient>();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    const hypercertClient = new HypercertClient({
      chain: { id: chainId },
      nftStorageToken: NFT_STORAGE_TOKEN,
      web3StorageToken: WEB3_STORAGE_TOKEN,
      easContractAddress: EAS_CONTRACT_ADDRESS,
      // @ts-ignore
      walletClient,
      // @ts-ignore
      publicClient,
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
