import { useForm } from "react-hook-form";
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
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

interface CreateOfferFormValues {
  fractionId: string;
  price: string;
}

export const CreateOrderForm = ({ hypercertId }: { hypercertId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOfferFormValues>({
    defaultValues: {
      price: "0.000000000000001",
    },
  });
  const { data: fractions, isLoading: fractionsLoading } =
    useFetchHypercertFractionsByHypercertId(hypercertId);
  const { data: currentOrdersForHypercert, isLoading: currentOrdersLoading } =
    useFetchMarketplaceOrdersForHypercert(hypercertId);
  const toast = useToast();
  const { mutateAsync: createMakerAsk } = useCreateMakerAsk();
  const address = useAddress();

  const onSubmit = async (values: CreateOfferFormValues) => {
    try {
      await createMakerAsk(values);
      toast({
        title: "Maker ask created",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <VStack>
        {hasFractionsWithoutActiveOrder ? (
          <>
            <FormControl isInvalid={!!errors.fractionId}>
              <FormLabel htmlFor="fractionId">Fraction ID</FormLabel>
              <Select
                {...register("fractionId", {
                  required: "Fraction ID is required",
                })}
              >
                {yourFractionsWithoutActiveOrder.map((fraction) => (
                  <option key={fraction.id} value={fraction.id}>
                    {formatAddress(fraction.id)} - {fraction.units} units
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.fractionId && errors.fractionId.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.price}>
              <FormLabel htmlFor="price">Price</FormLabel>
              <Input
                id="price"
                placeholder="Price"
                {...register("price", { required: "Price is required" })}
              />
              <FormErrorMessage>
                {errors.price && errors.price.message}
              </FormErrorMessage>
            </FormControl>
            <Center>
              <Button colorScheme="teal" type="submit">
                Put on sale
              </Button>
            </Center>
          </>
        ) : (
          <Alert status="error">You don{"'"}t have any fractions to sell</Alert>
        )}
      </VStack>
    </form>
  );
};
