import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useBuyFractionalMakerAsk } from "@/hooks/marketplace/useBuyFractionalMakerAsk";
import { MarketplaceOrderEntity } from "@/types/database-entities";

export interface BuyFractionalOrderFormValues {
  unitAmount: string;
  pricePerUnit: string;
}

export const BuyFractionalOrderForm = ({
  order,
}: {
  order: MarketplaceOrderEntity;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyFractionalOrderFormValues>({
    defaultValues: {
      unitAmount: "20",
      pricePerUnit: "0.00000000000001",
    },
  });
  const { mutateAsync: buyFractionalMakerAsk } = useBuyFractionalMakerAsk();

  const onSubmit = async (values: BuyFractionalOrderFormValues) => {
    await buyFractionalMakerAsk({
      order,
      unitAmount: values.unitAmount,
      pricePerUnit: values.pricePerUnit,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading mb={4}>Buy Fractional Order Form</Heading>
      <VStack>
        <FormControl isInvalid={!!errors.unitAmount}>
          <FormLabel>Unit Amount</FormLabel>
          <Input {...register("unitAmount")} />
          <FormErrorMessage>
            {errors.unitAmount && errors.unitAmount.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.pricePerUnit}>
          <FormLabel>Price Per Unit</FormLabel>
          <Input {...register("pricePerUnit")} />
          <FormErrorMessage>
            {errors.pricePerUnit && errors.pricePerUnit.message}
          </FormErrorMessage>
        </FormControl>

        <Button variant={"blackAndWhite"} type="submit">
          Buy
        </Button>
      </VStack>
    </form>
  );
};
