import { Box, Text, VStack } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { useChainId } from "wagmi";
import { useRouter } from "next/router";
import Head from "next/head";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AllowlistMinter } from "../minting/allowlist-minter";
import { FrontierFoundationConnectButton } from "./connect-button";

export const FrontierMintingForm = () => {
  const isMobile = useIsMobile();

  const chainId = useChainId();

  const { push } = useRouter();

  const onComplete = async (txHash?: string) => {
    await push(`/?page=thank-you&chainId=${chainId}&txHash=${txHash}`);
  };

  return (
    <>
      <Head>
        <title>Mint - Frontier Foundation</title>
      </Head>
      <Box px={isMobile ? 2 : 0}>
        <Box mb={"80px"}>
          <VStack textAlign={"center"} spacing={6}>
            <Text textTransform={"uppercase"} fontSize={48}>
              Mint your hypercert
            </Text>
            <FrontierFoundationConnectButton />

            <AllowlistMinter onComplete={onComplete} />
          </VStack>
        </Box>
      </Box>
    </>
  );
};
