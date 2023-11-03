import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useHypercertClient } from "@/components/providers";
import { SingleRegistrySelector } from "@/components/admin/registry-selector";
import { useFetchRegistryById } from "@/hooks/useFetchRegistryById";
import { useEffect } from "react";
import { useFetchHyperboardRegistryById } from "@/hooks/useFetchHyperboardRegistryById";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMyHyperboards } from "@/hooks/useMyHyperboards";

export interface CreateOrUpdateHyperboardRegistryFormValues {
  label: string;
  registry: {
    value: string;
    label: string;
  };
}

export const CreateOrUpdateHyperboardRegistryForm = ({
  hyperboardId,
  registryId,
  initialValues = {},
  onComplete,
}: {
  hyperboardId: string;
  registryId?: string;
  initialValues?: Partial<CreateOrUpdateHyperboardRegistryFormValues>;
  onComplete?: () => void;
}) => {
  const { refetch } = useMyHyperboards();
  const { data: registryData } = useFetchRegistryById(registryId);
  const { data: hyperboardRegistryData } = useFetchHyperboardRegistryById(
    hyperboardId,
    registryId,
  );

  const {
    control,
    register,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<CreateOrUpdateHyperboardRegistryFormValues>({
    reValidateMode: "onBlur",
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (registryData?.data) {
      setValue("registry", {
        value: registryData.data.id,
        label: registryData.data.name,
      });
    }
  }, [registryData?.data, setValue]);

  useEffect(() => {
    if (hyperboardRegistryData?.data?.label) {
      setValue("label", hyperboardRegistryData.data.label);
    }
  }, [hyperboardRegistryData?.data, setValue]);

  const toast = useToast();
  const client = useHypercertClient();

  const getClient = useGetAuthenticatedClient();
  const isEdit = !!registryId;

  const onSubmit = async (
    values: CreateOrUpdateHyperboardRegistryFormValues,
  ) => {
    const supabase = await getClient();

    if (!client) {
      toast({
        title: "Client is not initialized",
        status: "error",
      });
      return;
    }

    if (!supabase) {
      toast({
        title: "Supabase is not initialized",
        status: "error",
      });
      return;
    }

    if (!hyperboardId) {
      toast({
        title: "Hyperboard ID is required",
        status: "error",
      });
      return;
    }

    const upsertValue = {
      label: values.label,
      registry_id: values.registry.value,
      hyperboard_id: hyperboardId,
    };

    try {
      await supabase.from("hyperboard_registries").upsert(upsertValue);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not create or update hyperboard registry",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    await refetch();
    onComplete?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <FormControl isInvalid={!!errors.registry}>
          <FormLabel>Registry ID</FormLabel>
          <Controller
            control={control}
            render={(props) => (
              <SingleRegistrySelector
                isDisabled={isEdit || isSubmitting}
                {...props.field}
              />
            )}
            name={"registry"}
          />
          <FormErrorMessage>{errors.registry?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.label}>
          <FormLabel>Label</FormLabel>
          <Input
            disabled={isSubmitting}
            {...register("label", {
              required: "This is required",
              minLength: {
                value: 4,
                message: "Minimum length should be 4",
              },
            })}
          />
          <FormErrorMessage>{errors.label?.message}</FormErrorMessage>
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">
          Submit
        </Button>
      </VStack>
    </form>
  );
};
