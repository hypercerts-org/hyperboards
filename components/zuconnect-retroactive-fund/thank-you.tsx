import { Heading, VStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TransactionHistory } from "@/components/zuconnect-retroactive-fund/transaction-history";
import Link from "next/link";

export const ThankYou = () => {
  const { query } = useRouter();

  const txHash = query["txHash"];
  return (
    <>
      <VStack spacing={6} textAlign={"center"} mb={12}>
        <Heading textTransform={"uppercase"} fontSize={48}>
          Thank you
        </Heading>
        <Text fontSize={"lg"}>
          If your transaction was successful, you will see it in the list below
          (it might take a few minutes) or check it on{" "}
          <a target={"_blank"} href={`https://etherscan.io/tx/${txHash}`}>
            <u>etherscan</u>
          </a>
          .
        </Text>

        <Text fontSize={"lg"}>
          We will email you about the next steps. If you have questions, please
          reach out to zuzalu [at] hypercerts.org.
        </Text>
        <Text textDecoration={"underline"} fontSize={"lg"}>
          <Link href={"/"}>Go back to the donation form</Link>
        </Text>
      </VStack>
      <TransactionHistory />
    </>
  );
};
