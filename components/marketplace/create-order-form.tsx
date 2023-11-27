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

interface CreateOfferFormValues {
  fractionId: string;
  price: string;
}

export interface Order {
  collection: string;
  collectionType: number;
  strategyId: number;
  subsetNonce: number;
  orderNonce: number;
  endTime: number;
  price: bigint;
  itemIds: string[];
  amounts?: number[];
  startTime?: number;
  additionalParams: string;
  currency: string;
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
  const { data, isLoading } =
    useFetchHypercertFractionsByHypercertId(hypercertId);
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

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!data) {
    return (
      <Center>
        <Heading size={"md"}>Hypercert fractions not found</Heading>
      </Center>
    );
  }

  const yourFractions = data.filter((fraction) => fraction.owner === address);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <VStack>
        <FormControl isInvalid={!!errors.fractionId}>
          <FormLabel htmlFor="fractionId">Fraction ID</FormLabel>
          <Select
            {...register("fractionId", { required: "Fraction ID is required" })}
          >
            {yourFractions.map((fraction) => (
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
      </VStack>
    </form>
  );
};
