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
import { usePublicClient, useSendTransaction } from "wagmi";
import { EDGECITY_DONATION_SAFE_ADDRESS } from "@/config";
import { parseEther } from "viem";
import { supabase } from "@/lib/supabase";
import { useAddress } from "@/hooks/useAddress";
import { MoreInformationModal } from "@/components/edgecity-fund/more-information-modal";
import { TransactionHistory } from "@/components/edgecity-fund/transaction-history";
import { useRouter } from "next/router";
import { ZuzaluConnectButton } from "@/components/edgecity-fund/connect-button";
import { useQuery } from "@tanstack/react-query";
import { AwaitTransactionModal } from "@/components/edgecity-fund/await-transaction-modal";
import { toPrecision } from "@chakra-ui/utils";
import { isValidEmail } from "@/utils/validation";
import Head from "next/head";
import { useIsMobile } from "@/hooks/useIsMobile";

type FormValues = {
  amount: number;
  email: string;
  agreement: boolean;
};

export const DonationForm = () => {
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

  const { data: ethPrice } = useCurrentEthPrice();

  const { push } = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid, errors, isSubmitting },
    getValues,
    watch,
  } = useForm<FormValues>({
    defaultValues: {},
    reValidateMode: "onChange",
  });

  const handleEmailValidation = (email: string) => {
    return isValidEmail(email);
  };

  const amount = watch("amount");

  const sendDonation = useSendDonation({
    amount,
  });

  const onSubmit = async () => {
    if (!address) {
      console.log("no address");
      return;
    }

    transactionOnOpen();
    const { amount, email } = getValues();

    try {
      await addEmailToDonationList(address, email, amount);
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "There was an error adding your email to the list",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      transactionOnClose();
      return;
    }

    let txHash = "";

    try {
      txHash = await sendDonation();
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "There was an error sending your transaction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      transactionOnClose();
      return;
    }

    toast({
      title: "Transaction confirmed",
      description: "Your transaction has been confirmed",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    transactionOnClose();
    await push(`/?page=thank-you&txHash=${txHash}`);
  };

  return (
    <>
      <Head>
        <title>Donate - Zuconnect Retroactive Fund</title>
      </Head>
      <Box px={isMobile ? 2 : 0}>
        <Box mb={"80px"}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack textAlign={"center"} spacing={6}>
              <Heading textTransform={"uppercase"} fontSize={"xxl"}>
                ZuConnect
                <br /> Retroactive Fund
              </Heading>
              <Text fontSize={"lg"}>
                Commit funds now and distribute them to your <br /> most valued
                experiences after the event
              </Text>
              <Text
                textDecoration={"underline"}
                cursor={"pointer"}
                onClick={moreInfoOnOpen}
              >
                More information
              </Text>
              <VStack spacing={6}>
                <FormControl isInvalid={!!errors.amount} w={"100%"} py={"16px"}>
                  <InputGroup>
                    <Input
                      bg={"white"}
                      border={"none"}
                      type={"number"}
                      isDisabled={isSubmitting}
                      placeholder={"Amount (min. 0.01 ETH)"}
                      step={"any"}
                      {...register("amount", {
                        required: "This is required",
                        valueAsNumber: true,
                        min: {
                          value: 0.01,
                          message: "Minimum amount is 0.01",
                        },
                      })}
                    />
                    <InputRightAddon>ETH</InputRightAddon>
                  </InputGroup>
                  <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                  {ethPrice && (
                    <Text fontSize={"md"} mt={2}>
                      ≈ $
                      {!isNaN(amount) ? toPrecision(ethPrice * amount, 2) : 0}
                    </Text>
                  )}
                </FormControl>
                <VStack w={"100%"}>
                  <Text fontSize={"md"}>
                    To notify you about the next steps
                  </Text>
                  <FormControl isInvalid={!!errors.email}>
                    <Input
                      type="email"
                      bg={"white"}
                      border={"none"}
                      isDisabled={isSubmitting}
                      placeholder={"Email"}
                      {...register("email", {
                        required: "An email address is required",
                        validate: handleEmailValidation,
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email?.message || "Invalid email"}
                    </FormErrorMessage>
                  </FormControl>
                </VStack>
                <FormControl isInvalid={!!errors.agreement} w={"fit-content"}>
                  <Flex alignItems={"center"}>
                    <Checkbox
                      bg={"white"}
                      mr={2}
                      {...register("agreement", { required: true })}
                    />
                    <Text fontSize={"md"}>
                      I agree to the{" "}
                      <a
                        style={{ textDecoration: "underline" }}
                        href="https://hypercerts.org/terms"
                        target="_blank"
                      >
                        Terms & Conditions
                      </a>
                    </Text>
                  </Flex>
                </FormControl>
              </VStack>
              <HStack>
                <ZuzaluConnectButton />
                <Button
                  bg={"#41645F"}
                  color={"white"}
                  type={"submit"}
                  isDisabled={!isValid}
                >
                  Confirm
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
        <TransactionHistory />
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

const useSendDonation = ({ amount }: { amount: number }) => {
  const toast = useToast();
  let valueInWei = parseEther("0");
  if (!isNaN(amount)) {
    try {
      valueInWei = parseEther(amount.toString());
    } catch (e) {
      console.log(e);
    }
  }
  const publicClient = usePublicClient();

  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onSettled: async () => {
        toast({
          title: "Transaction sent",
          description: "Your donation is pending",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    },
  });

  return async () => {
    if (!publicClient) {
      throw new Error("Public client not initialized");
    }
    const hash = await sendTransactionAsync({
      to: EDGECITY_DONATION_SAFE_ADDRESS as `0x${string}`,
      value: valueInWei,
    });

    await publicClient.waitForTransactionReceipt({
      hash,
    });
    return hash;
  };
};

const addEmailToDonationList = (
  address: string,
  email: string,
  amount: number,
) =>
  supabase.from("zuzalu_donations").insert({
    address,
    email,
    amount: amount.toString(),
  });

const useCurrentEthPrice = () => {
  return useQuery({
    queryKey: ["current-eth-price"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        { method: "GET" },
      );
      const data = (await response.json()) as { ethereum: { usd: number } };
      return data.ethereum.usd;
    },
  });
};
