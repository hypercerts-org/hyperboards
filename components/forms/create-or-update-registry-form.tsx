import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  Control,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { RegistryInsert } from "@/types/database-entities";
import { DeleteClaimButton } from "@/components/admin/delete-claim-button";

export interface CreateOrUpdateHyperboardFormProps {
  onSubmitted: (values: CreateUpdateRegistryFormValues) => void;
  initialValues?: Partial<CreateUpdateRegistryFormValues>;
}

const minimumCharacters = 40;

export type CreateUpdateRegistryFormValues = RegistryInsert & {
  claims: { claim_id?: string; hypercert_id: string }[];
};

export const CreateOrUpdateRegistryForm = ({
  onSubmitted,
  initialValues = {},
}: CreateOrUpdateHyperboardFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CreateUpdateRegistryFormValues>({
    defaultValues: { claims: [], ...initialValues },
  });

  // TODO: Add validation whether claim is on correct chain etc
  return (
    <form onSubmit={handleSubmit(onSubmitted)} style={{ width: "100%" }}>
      <VStack>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            placeholder="Name of the registry"
            {...register("name", {
              required: "This is required",
              minLength: {
                value: 4,
                message: "Minimum length should be 4",
              },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            placeholder={"Description of the registry"}
            {...register("description", {
              required: "This is required",
              minLength: {
                value: minimumCharacters,
                message: `Minimum length should be ${minimumCharacters}`,
              },
            })}
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.claims}>
          <FormLabel htmlFor="claims">Claims</FormLabel>
          <ClaimsField register={register} control={control} />
          <FormErrorMessage>
            {errors.claims && errors.claims.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};

const ClaimsField = ({
  register,
  control,
}: {
  control: Control<CreateUpdateRegistryFormValues>;
  register: UseFormRegister<CreateUpdateRegistryFormValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "claims",
  });

  console.log(fields);

  return (
    <VStack alignItems={"flex-start"}>
      {fields.map((item, index) => (
        <HStack key={item.id}>
          <Input {...register(`claims.${index}.hypercert_id`)} />
          {item.claim_id ? (
            <DeleteClaimButton claimId={item.claim_id} />
          ) : (
            <Button
              colorScheme="red"
              type="button"
              onClick={() => remove(index)}
            >
              Delete
            </Button>
          )}
        </HStack>
      ))}
      <Button type="button" onClick={() => append({ hypercert_id: "" })}>
        + add another claim
      </Button>
    </VStack>
  );
};
