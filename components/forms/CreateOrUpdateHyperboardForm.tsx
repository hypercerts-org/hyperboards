import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { HyperboardInsert } from "@/types/database-entities";

export interface CreateOrUpdateHyperboardFormValues {
  name: string;
}

export interface CreateOrUpdateHyperboardFormProps {
  onSubmitted: (values: CreateOrUpdateHyperboardFormValues) => void;
  initialValues?: Partial<CreateOrUpdateHyperboardFormValues>;
}

export const CreateOrUpdateHyperboardForm = ({
  onSubmitted,
  initialValues = {},
}: CreateOrUpdateHyperboardFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<HyperboardInsert>({
    defaultValues: initialValues,
  });
  return (
    <form onSubmit={handleSubmit(onSubmitted)}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          placeholder="Name of the board"
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
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};
