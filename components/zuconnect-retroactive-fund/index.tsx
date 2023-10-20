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
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

type FormValues = {
  amount: number;
  email: string;
  agreement: boolean;
};

export const ZuconnectRetroactiveFund = () => {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormValues>();
  const onSubmit = async () => {
    console.log("Submitted");
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
              placeholder={"Amount"}
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
        </FormControl>
        <VStack>
          <Text>To notify you about the next steps</Text>
          <FormControl isInvalid={!!errors.email}>
            <Input
              type="email"
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
