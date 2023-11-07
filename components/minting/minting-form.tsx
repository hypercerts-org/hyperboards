import { useForm } from "react-hook-form";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

export interface MintingFormValues {
  name: string;
  workScope: string;
  description: string;
  externalUrl: string;
  workStart: Date;
  workEnd: Date;
  contributors: string;
}

// Default values minting form for testing
export const defaultMintingFormValues: MintingFormValues = {
  name: "Test",
  workScope: "Test",
  description: "Test",
  externalUrl: "Test",
  workStart: new Date(),
  workEnd: new Date(),
  contributors: "Test",
};

const useMintingForm = (initialValues?: MintingFormValues) =>
  useForm<MintingFormValues>({
    defaultValues: initialValues || defaultMintingFormValues,
  });

export const MintingForm = ({
  onSubmit,
  initialValues,
  buttonLabel = "Submit",
}: {
  onSubmit: (values: MintingFormValues) => void;
  initialValues?: MintingFormValues;
  buttonLabel?: string;
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useMintingForm(initialValues);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction={"column"} width={"100%"}>
        <VStack minHeight={"100%"} spacing={4} alignItems={"flex-start"}>
          <FormControl isInvalid={!!errors.name?.message}>
            <FormLabel>Name</FormLabel>
            <Input {...register("name")} isDisabled={isSubmitting} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.workScope?.message}>
            <FormLabel>Work Scope</FormLabel>
            <Input {...register("workScope")} isDisabled={isSubmitting} />
            <FormErrorMessage>{errors.workScope?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.description?.message}>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} isDisabled={isSubmitting} />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.externalUrl?.message}>
            <FormLabel>External URL</FormLabel>
            <Input {...register("externalUrl")} isDisabled={isSubmitting} />
            <FormErrorMessage>{errors.externalUrl?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.workStart?.message}>
            <FormLabel>Work Start</FormLabel>
            <SingleDatepicker
              disabled={isSubmitting}
              name="date-work-start"
              onDateChange={(e) => setValue("workStart", e)}
              date={watch("workStart")}
            />
            <FormErrorMessage>{errors.workStart?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.workEnd?.message}>
            <FormLabel>Work End</FormLabel>
            <SingleDatepicker
              disabled={isSubmitting}
              onDateChange={(e) => setValue("workEnd", e)}
              name="date-work-end"
              date={watch("workEnd")}
            />
            <FormErrorMessage>{errors.workEnd?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.contributors?.message}>
            <FormLabel>Contributors</FormLabel>
            <Input isDisabled={isSubmitting} {...register("contributors")} />
            <FormErrorMessage>{errors.contributors?.message}</FormErrorMessage>
          </FormControl>
          <Button type={"submit"} isDisabled={isSubmitting}>
            {buttonLabel}
          </Button>
        </VStack>
      </Flex>
    </form>
  );
};
