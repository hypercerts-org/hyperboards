import { useForm } from "react-hook-form";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { formatAddress } from "@/utils/formatting";
import { useAddress } from "@/hooks/useAddress";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { useCreateFractionalMakerAsk } from "@/hooks/marketplace/useCreateFractionalMakerAsk";

export interface CreateFractionalOfferFormValues {
  fractionId: string;
  minUnitAmount: string;
  maxUnitAmount: string;
  minUnitsToKeep: string;
  price: string;
  sellLeftoverFraction: boolean;
}

export const CreateFractionalOrderForm = ({
  hypercertId,
  onClickViewListings,
}: {
  hypercertId: string;
  onClickViewListings?: () => void;
}) => {
  const [step, setStep] = React.useState<"form" | "confirmation">("form");
  const { data: fractions, isLoading: fractionsLoading } =
    useFetchHypercertFractionsByHypercertId(hypercertId);
  const { data: currentOrdersForHypercert, isLoading: currentOrdersLoading } =
    useFetchMarketplaceOrdersForHypercert(hypercertId);
  const toast = useToast();
  const { mutateAsync: createFractionalMakerAsk } = useCreateFractionalMakerAsk(
    {
      hypercertId,
    },
  );
  const address = useAddress();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateFractionalOfferFormValues>({
    defaultValues: {
      minUnitAmount: "10",
      maxUnitAmount: "100",
      minUnitsToKeep: "20",
      price: "0.00000000000001",
      sellLeftoverFraction: false,
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  });

  const onSubmit = async (values: CreateFractionalOfferFormValues) => {
    try {
      await createFractionalMakerAsk(values);
      toast({
        title: "Maker ask created",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setStep("confirmation");
    } catch (e) {
      toast({
        title: "Could not create maker ask",
        description: e?.toString(),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const loading = fractionsLoading || currentOrdersLoading;

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!fractions) {
    return (
      <Center>
        <Heading size={"md"}>Hypercert fractions not found</Heading>
      </Center>
    );
  }

  const yourFractions = fractions.filter(
    (fraction) => fraction.owner === address,
  );

  const fractionsWithActiveOrder = currentOrdersForHypercert?.orders
    ? Object.values(currentOrdersForHypercert.orders).map(
        (order) => order.fraction?.id,
      )
    : [];

  const yourFractionsWithoutActiveOrder = yourFractions.filter(
    (fraction) => !fractionsWithActiveOrder.includes(fraction.id),
  );

  const hasFractionsWithoutActiveOrder =
    yourFractionsWithoutActiveOrder.length > 0;

  const disableInputs = isSubmitting;
  const submitDisabled = !isValid || disableInputs;

  return (
    <Flex height={"100%"}>
      {step === "form" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "100%", minHeight: "500px" }}
        >
          <VStack height={"100%"} alignItems={"flex-start"}>
            <Text
              fontSize={"lg"}
              fontWeight={500}
              lineHeight={"28px"}
              pb={"18px"}
            >
              Create fractional sale
            </Text>
            <Alert status="info" maxW={"auto"}>
              <AlertIcon />
              You can create a fractional sale for your hypercert so that the
              buyer can decide how many units they want to buy.
            </Alert>
            {hasFractionsWithoutActiveOrder ? (
              <VStack height={"100%"}>
                <FormControl isInvalid={!!errors.fractionId} pb={6}>
                  <FormLabel htmlFor="fractionId">
                    Fraction to sell from
                  </FormLabel>
                  <Select
                    disabled={disableInputs}
                    {...register("fractionId", {
                      required: "Fraction ID is required",
                    })}
                  >
                    {yourFractionsWithoutActiveOrder.map((fraction) => (
                      <option key={fraction.id} value={fraction.id}>
                        {formatAddress(fraction.id)} - {fraction.percentage}%
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.fractionId && errors.fractionId.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.price} pb={6}>
                  <FormLabel htmlFor="price">Price per unit</FormLabel>
                  <InputGroup>
                    <Input
                      disabled={disableInputs}
                      {...register("price", {
                        required: "Price is required",
                      })}
                    />
                    <InputRightElement>ETH</InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.price && errors.price.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.minUnitAmount} pb={6}>
                  <FormLabel htmlFor="unitAmount">
                    Minimum amount of units per sale
                  </FormLabel>
                  <Input
                    disabled={disableInputs}
                    {...register("minUnitAmount", {
                      required: "Unit amount is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.minUnitAmount && errors.minUnitAmount.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.maxUnitAmount} pb={6}>
                  <FormLabel htmlFor="maxUnitAmount">
                    Maximum amount of units per sale
                  </FormLabel>
                  <Input
                    disabled={disableInputs}
                    {...register("maxUnitAmount", {
                      required: "Max unit amount is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.maxUnitAmount && errors.maxUnitAmount.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.minUnitsToKeep} pb={6}>
                  <FormLabel htmlFor="minUnitsToKeep">
                    Minimum amount of units I would like to keep
                  </FormLabel>
                  <Input
                    disabled={disableInputs}
                    {...register("minUnitsToKeep", {
                      required: "Min units to keep is required",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.minUnitsToKeep && errors.minUnitsToKeep.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.sellLeftoverFraction} pb={6}>
                  <FormLabel htmlFor="sellLeftoverFraction">
                    Sell leftover units if there are less then the minimum
                  </FormLabel>
                  <Switch
                    disabled={disableInputs}
                    {...register("sellLeftoverFraction")}
                  />
                  <FormErrorMessage>
                    {errors.sellLeftoverFraction &&
                      errors.sellLeftoverFraction.message}
                  </FormErrorMessage>
                </FormControl>

                <Center width={"100%"} marginTop={"auto"}>
                  <Button
                    isDisabled={submitDisabled}
                    width={"100%"}
                    variant={"blackAndWhite"}
                    type="submit"
                  >
                    Create
                  </Button>
                </Center>
              </VStack>
            ) : (
              <Alert status="error">
                You don{"'"}t have any fractions to sell
              </Alert>
            )}
          </VStack>
        </form>
      )}
      {step === "confirmation" && (
        <VStack
          width={"100%"}
          height={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          spacing={6}
          minHeight={"500px"}
        >
          <Center flexDirection={"column"} flexGrow={1}>
            <Text
              textStyle={"secondary"}
              fontSize={"xxl"}
              textAlign={"center"}
              lineHeight={"100%"}
              mb={7}
            >
              Successfully <br />
              listed
            </Text>
            <Text>Your hypercert fractions are on sale now.</Text>
          </Center>
          {onClickViewListings && (
            <Button
              onClick={onClickViewListings}
              variant={"blackAndWhite"}
              width={"100%"}
            >
              View your listings
            </Button>
          )}
        </VStack>
      )}
    </Flex>
  );
};
