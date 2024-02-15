import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useBuyFractionalMakerAsk } from "@/hooks/marketplace/useBuyFractionalMakerAsk";
import { MarketplaceOrderEntity } from "@/types/database-entities";
import { formatEther } from "viem";

export interface BuyFractionalOrderFormValues {
  unitAmount: string;
  pricePerUnit: string;
}

export const BuyFractionalOrderForm = ({
  order,
  onCompleted,
}: {
  order: MarketplaceOrderEntity;
  onCompleted?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyFractionalOrderFormValues>({
    defaultValues: {
      unitAmount: "20",
      pricePerUnit: formatEther(BigInt(order.price)),
    },
  });
  const { mutateAsync: buyFractionalMakerAsk } = useBuyFractionalMakerAsk();

  const onSubmit = async (values: BuyFractionalOrderFormValues) => {
    await buyFractionalMakerAsk({
      order,
      unitAmount: values.unitAmount,
      pricePerUnit: values.pricePerUnit,
    });
    onCompleted?.();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <FormControl isInvalid={!!errors.unitAmount}>
          <FormLabel>Number of units to buy</FormLabel>
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

        <Button width={"100%"} variant={"blackAndWhite"} type="submit">
          Execute
        </Button>
      </VStack>
    </form>
  );
};
