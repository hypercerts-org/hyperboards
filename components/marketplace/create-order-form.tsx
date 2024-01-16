import { useFieldArray, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Center,
  CloseButton,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useCreateMakerAsk } from "@/hooks/marketplace/useCreateMakerAsk";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { formatAddress } from "@/utils/formatting";
import { useAddress } from "@/hooks/useAddress";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import { Alert } from "@chakra-ui/alert";

export interface CreateOfferFormValues {
  fractionId: string;
  listings: {
    percentage?: number;
    price?: string;
  }[];
}

export const CreateOrderForm = ({
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
  const { mutateAsync: createMakerAsk } = useCreateMakerAsk({ hypercertId });
  const address = useAddress();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    watch,
  } = useForm<CreateOfferFormValues>({
    defaultValues: {
      listings: [
        {
          percentage: undefined,
          price: undefined,
        },
      ],
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  });

  const selectedFractionId = watch("fractionId");
  const selectedFraction = fractions?.find(
    (fraction) => fraction.id === selectedFractionId,
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "listings",
    rules: {
      required: true,
      minLength: 1,
      validate: (value) => {
        if (!selectedFraction) {
          return "Fraction ID is required";
        }

        const sumOfAllPercentages = value.reduce(
          (acc, { percentage }) => acc + (percentage ?? 0),
          0,
        );

        if (sumOfAllPercentages > selectedFraction.percentage) {
          return "Sum of all percentages must be lower than fraction percentage";
        }
      },
    },
  });

  const onSubmit = async (values: CreateOfferFormValues) => {
    try {
      await createMakerAsk(values);
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

  const listings = watch("listings");
  const totalPercentage = listings.reduce(
    (acc, { percentage }) => acc + (percentage || 0),
    0,
  );

  const disableInputs = isSubmitting;
  const submitDisabled = !isValid || disableInputs || totalPercentage === 0;

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
              pb={"30px"}
            >
              Split your ownership part
              <br /> into fractions to list them for sale.
            </Text>
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
                <VStack width={"100%"} divider={<Divider />}>
                  <FormControl isInvalid={!!errors.listings?.root}>
                    <VStack width={"100%"} divider={<Divider />}>
                      {fields.map((item, index) => (
                        <HStack key={item.id}>
                          <Text textStyle={"secondary"}>
                            {(index + 1).toString().padStart(2, "0")}.
                          </Text>

                          <InputGroup>
                            <Input
                              disabled={disableInputs}
                              type="number"
                              step="0.01"
                              {...register(`listings.${index}.percentage`, {
                                valueAsNumber: true,
                                min: 0,

                                max: selectedFraction?.percentage,
                                required: "Required",
                              })}
                              placeholder="0.00"
                              variant="gray"
                              isDisabled={!selectedFraction}
                              isInvalid={!!errors.listings?.[index]?.percentage}
                              _invalid={{
                                borderWidth: "2px",
                                borderColor: "red.300",
                              }}
                            />
                            <InputRightElement opacity={0.6} ml={0}>
                              %
                            </InputRightElement>
                          </InputGroup>

                          <Text>for</Text>
                          <InputGroup>
                            <Input
                              disabled={disableInputs}
                              {...register(`listings.${index}.price`, {
                                required: "Required",
                              })}
                              placeholder="0.000"
                              variant="gray"
                              isDisabled={!selectedFraction}
                              isInvalid={!!errors.listings?.[index]?.price}
                              _invalid={{
                                borderWidth: "2px",
                                borderColor: "red.300",
                              }}
                            />
                            <InputRightElement opacity={0.6}>
                              ETH
                            </InputRightElement>
                          </InputGroup>
                          <CloseButton
                            onClick={() => remove(index)}
                            isDisabled={fields.length === 1}
                          />
                        </HStack>
                      ))}
                    </VStack>
                    <FormErrorMessage>
                      {errors.listings?.root && errors.listings?.root.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    isDisabled={disableInputs}
                    onClick={() =>
                      append({ percentage: undefined, price: undefined })
                    }
                    variant="gray"
                    width={"100%"}
                    justifyContent={"flex-start"}
                  >
                    +
                    <Box ml={2} as={"span"} opacity={0.5}>
                      add fraction
                    </Box>
                  </Button>
                </VStack>
                <Center width={"100%"} marginTop={"auto"}>
                  <Button
                    isDisabled={submitDisabled}
                    width={"100%"}
                    variant={"blackAndWhite"}
                    type="submit"
                  >
                    {totalPercentage === 0
                      ? "List for sale"
                      : `List total of ${totalPercentage}% for sale`}
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
