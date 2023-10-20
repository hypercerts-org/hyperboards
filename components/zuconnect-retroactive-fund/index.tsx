import {
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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { usePublicClient, useSendTransaction } from "wagmi";
import { requireEnv } from "@/config";
import { parseEther } from "viem";
import { supabase } from "@/lib/supabase";
import { useAddress } from "@/hooks/useAddress";

type FormValues = {
  amount: string;
  email: string;
  agreement: boolean;
};

const SAFE_ADDRESS = requireEnv(
  process.env.NEXT_PUBLIC_ZUZALU_DONATION_SAFE,
  "NEXT_PUBLIC_ZUZALU_DONATION_SAFE",
);

export const ZuconnectRetroactiveFund = () => {
  const toast = useToast();
  const address = useAddress();

  const {
    handleSubmit,
    register,
    formState: { isValid, errors, isSubmitting },
    getValues,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      amount: "0",
    },
  });

  const amount = watch("amount");

  const sendDonation = useSendDonation({
    amount,
  });

  const onSubmit = async () => {
    if (!address) {
      return;
    }

    const { amount, email } = getValues();

    try {
      await addEmailToDonationList(address, email, amount);
    } catch (e) {
      console.log(e);
      return;
    }

    try {
      await sendDonation();
    } catch (e) {
      console.log(e);
      return;
    }

    toast({
      title: "Transaction confirmed",
      description: "Your donation has been confirmed",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <Heading>Zuconnect Retroactive Fund</Heading>
        <Text>
          Commit funds now and distribute them to your most valued experiences
          after the event
        </Text>
        <Text textDecoration={"underline"}>More information</Text>
        <FormControl isInvalid={!!errors.amount} w={"fit-content"}>
          <InputGroup>
            <Input
              defaultValue={0}
              isDisabled={isSubmitting}
              placeholder={"Amount"}
              {...register("amount", {
                required: "This is required",
                min: {
                  value: 0.01,
                  message: "Minimum amount is 0.01",
                },
              })}
            />
            <InputRightAddon>ETH</InputRightAddon>
          </InputGroup>
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>
        <VStack>
          <Text>To notify you about the next steps</Text>
          <FormControl isInvalid={!!errors.email}>
            <Input
              type="email"
              isDisabled={isSubmitting}
              placeholder={"Email"}
              {...register("email", {
                required: "An email address is required",
              })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
        </VStack>
        <FormControl isInvalid={!!errors.agreement} w={"fit-content"}>
          <Flex alignItems={"center"}>
            <Checkbox mr={2} {...register("agreement", { required: true })} />{" "}
            <Text>I agree to the Terms & Conditions</Text>
          </Flex>
        </FormControl>
        <HStack>
          <ConnectButton />
          <Button type={"submit"} isDisabled={!isValid}>
            Confirm
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

const useSendDonation = ({ amount }: { amount: string }) => {
  const toast = useToast();
  const valueInWei = parseEther(amount);
  const publicClient = usePublicClient();

  const { sendTransactionAsync } = useSendTransaction({
    to: SAFE_ADDRESS,
    value: valueInWei,
    onSuccess: async (data) => {
      console.log(data);
      toast({
        title: "Transaction sent",
        description: "Your donation has been sent",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return async () => {
    const hash = await sendTransactionAsync();
    await publicClient.waitForTransactionReceipt(hash);
  };
};

const addEmailToDonationList = (
  address: string,
  email: string,
  amount: string,
) =>
  supabase.from("zuzalu_donations").insert({
    address,
    email,
    amount,
  });
