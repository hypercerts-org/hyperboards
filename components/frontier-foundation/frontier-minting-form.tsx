import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import "@rainbow-me/rainbowkit/styles.css";
import { useChainId } from "wagmi";
import { useAddress } from "@/hooks/useAddress";
import { MoreInformationModal } from "@/components/zuconnect-retroactive-fund/more-information-modal";
import { useRouter } from "next/router";
import { AwaitTransactionModal } from "@/components/zuconnect-retroactive-fund/await-transaction-modal";
import Head from "next/head";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AllowlistMinter } from "../minting/allowlist-minter";
import { FrontierFoundationConnectButton } from "./connect-button";
import { HypercertClient } from "@hypercerts-org/sdk";
import { chain } from "lodash";

type FormValues = {
  amount: number;
  email: string;
  agreement: boolean;
};

export const FrontierMintingForm = () => {
  const isMobile = useIsMobile();
  const toast = useToast();
  const address = useAddress();
  const {
    isOpen: moreInfoModalOpen,
    onClose: moreInfoOnClose,
    onOpen: moreInfoOnOpen,
  } = useDisclosure();

  const {
    isOpen: transactionIsOpen,
    onOpen: transactionOnOpen,
    onClose: transactionOnClose,
  } = useDisclosure();

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
            <Heading textTransform={"uppercase"} fontSize={48}>
              Frontier Foundation
            </Heading>
            <Text fontSize={"lg"}>Mint your hypercert</Text>
            <FrontierFoundationConnectButton />
            <Text
              textDecoration={"underline"}
              cursor={"pointer"}
              onClick={moreInfoOnOpen}
            >
              More information
            </Text>
            <AllowlistMinter onComplete={onComplete} />
          </VStack>
        </Box>
      </Box>
      <AwaitTransactionModal
        isOpen={transactionIsOpen}
        onClose={transactionOnClose}
      />
      <MoreInformationModal
        isOpen={moreInfoModalOpen}
        onClose={moreInfoOnClose}
      />
    </>
  );
};
