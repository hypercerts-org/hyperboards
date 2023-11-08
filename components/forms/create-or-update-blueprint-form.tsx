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
import { useFetchRegistryById } from "@/hooks/useFetchRegistryById";
import { useEffect, useState } from "react";

interface FormValues {
  address: string;
  registryId: { label: string; value: string };
}

export const CreateOrUpdateBlueprintForm = ({
  registryId,
  onComplete,
}: {
  registryId?: string;
  onComplete?: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const address = useAddress();
  const { data: registryData } = useFetchRegistryById(registryId);

  const {
    control,
    register,
    getValues,
    setValue,

    formState: { errors },
  } = useForm<FormValues>({
    reValidateMode: "onBlur",
    defaultValues: {
      address,
    },
  });

  useEffect(() => {
    if (registryData?.data) {
      setValue("registryId", {
        value: registryData.data.id,
        label: registryData.data.name,
      });
    }
  }, [registryData?.data, setValue]);

  const toast = useToast();
  const client = useHypercertClient();
  const { mutateAsync: createBlueprint } = useCreateBlueprint();

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

    setSubmitting(true);

    try {
      await createBlueprint({
        ...values,
        address,
        registryId: registryId.value,
      });
      toast({
        title: "Blueprint created",
        status: "success",
      });
      setSubmitting(false);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error creating blueprint",
        description: e.message,
        status: "error",
      });
      setSubmitting(false);
      return;
    }

    onComplete?.();
  };

  return (
    <VStack>
      <FormControl isInvalid={!!errors.address}>
        <FormLabel>Minter Address</FormLabel>
        <Input
          {...register("address", {
            required: "Blueprint address is required",
          })}
          isDisabled={submitting}
        />
        <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.registryId}>
        <FormLabel>Registry ID</FormLabel>
        <Controller
          control={control}
          render={(props) => (
            <SingleRegistrySelector isDisabled={submitting} {...props.field} />
          )}
          name={"registryId"}
        />
        <FormErrorMessage>{errors.registryId?.message}</FormErrorMessage>
      </FormControl>
      <MintingForm onSubmit={onSubmitBluePrint} />
    </VStack>
  );
};
