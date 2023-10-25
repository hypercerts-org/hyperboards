import { Controller, useForm } from "react-hook-form";
import {
  MintingForm,
  MintingFormValues,
} from "@/components/minting/minting-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useAddress } from "@/hooks/useAddress";
import { useHypercertClient } from "@/components/providers";
import { useCreateBlueprint } from "@/hooks/useCreateBlueprint";
import { SingleRegistrySelector } from "@/components/admin/registry-selector";

interface FormValues {
  address: string;
  registryId: { label: string; value: string };
}

export const CreateOrUpdateBlueprintForm = ({
  onSubmit,
}: {
  onSubmit: (values: any) => void;
}) => {
  const address = useAddress();
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    reValidateMode: "onBlur",
    defaultValues: {
      address,
    },
  });
  const toast = useToast();
  const client = useHypercertClient();
  const { mutateAsync } = useCreateBlueprint();

  const onSubmitBluePrint = async (values: MintingFormValues) => {
    const address = getValues("address");
    const registryId = getValues("registryId");

    if (!client) {
      toast({
        title: "Client is not initialized",
        status: "error",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Blueprint address is required",
        status: "error",
      });
      return;
    }

    if (!registryId) {
      toast({
        title: "Registry is required",
        status: "error",
      });
      return;
    }

    try {
      const data = await mutateAsync({
        ...values,
        address,
        registryId: registryId.value,
      });
      toast({
        title: "Blueprint created",
        status: "success",
      });
      onSubmit({ ...values, address, data });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error creating blueprint",
        status: "error",
      });
    }

    // Validate form values
  };
  return (
    <VStack>
      <FormControl isInvalid={!!errors.address}>
        <FormLabel>Minter Address</FormLabel>
        <Input
          {...register("address", {
            required: "Blueprint address is required",
          })}
        />
        <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.registryId}>
        <FormLabel>Registry ID</FormLabel>
        {/*<SingleRegistrySelector {...register("registryId")} />*/}
        <Controller
          control={control}
          render={(props) => <SingleRegistrySelector {...props.field} />}
          name={"registryId"}
        />
        <FormErrorMessage>{errors.registryId?.message}</FormErrorMessage>
      </FormControl>
      <MintingForm onSubmit={onSubmitBluePrint} />
    </VStack>
  );
};
