import { Heading, VStack, Text, Button, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TransactionHistory } from "@/components/edgecity-fund/transaction-history";
import Link from "next/link";
import Head from "next/head";
import { useIsMobile } from "@/hooks/useIsMobile";

export const ThankYou = () => {
  const { query } = useRouter();
  const isMobile = useIsMobile();

  const txHash = query["txHash"];
  return (
    <>
      <Head>
        <title>Thank you - Zuconnect Retroactive Fund</title>
      </Head>
      <VStack spacing={6} textAlign={"center"} mb="80px" px={isMobile ? 2 : 0}>
        <Heading textTransform={"uppercase"} fontSize={48}>
          Thank you
        </Heading>
        <Text>
          We will send you an email notification once your hypercerts are 
          available for claim. If you have questions, please reach out to 
          team [at] hypercerts.org.
        </Text>
        <Text>
          View your transaction on{" "}
          <a target={"_blank"} href={`https://etherscan.io/tx/${txHash}`}>
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
          <Link target={"_blank"} href={"https://www.edgecity.live/"}>
            <Button bg={"#41645F"} color={"white"}>
              edgecity.live
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
