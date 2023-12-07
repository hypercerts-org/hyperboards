import { Heading, VStack, Text, Button, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TransactionHistory } from "@/components/zuconnect-retroactive-fund/transaction-history";
import Link from "next/link";
import Head from "next/head";
import { useIsMobile } from "@/hooks/useIsMobile";

export const ThankYou = () => {
  const { query } = useRouter();
  const isMobile = useIsMobile();

  const txHash = query["txHash"];
  const chainId = query["chainId"];

  const blockExporer =
    chainId === "10"
      ? "https://optimistic.etherscan.io"
      : chainId === "42220"
      ? "https://celoscan.io"
      : "";

  return (
    <>
      <Head>
        <title>Thank you - Frontier Foundation</title>
      </Head>
      <VStack spacing={6} textAlign={"center"} mb="80px" px={isMobile ? 2 : 0}>
        <Heading textTransform={"uppercase"} fontSize={48}>
          🚵🏼🚵🏼🚵🏼 Thank you 🚵🏼🚵🏼🚵🏼
        </Heading>
        <Text>Thanks for joining the action and supporting the community.</Text>
        <Text>
          View your transaction on{" "}
          <a target={"_blank"} href={`https://${blockExporer}/tx/${txHash}`}>
            <u>etherscan</u>
          </a>
          .
        </Text>

        <Stack dir={isMobile ? "vertical" : "horizontal"}>
          <Link href={"/"}>
            <Button variant={"outline"} bg={"#e3e1e1"}>
              Back to the form
            </Button>
          </Link>
          <Link target={"_blank"} href={"https://hypercerts.org/"}>
            <Button bg={"#41645F"} color={"white"}>
              frontier.foundation
            </Button>
          </Link>
          <Link href="https://hypercerts.org/" target="_blank">
            <Button bg={"#41645F"} color={"white"}>
              hypercerts.org
            </Button>
          </Link>
        </Stack>
      </VStack>
      <TransactionHistory />
    </>
  );
};
