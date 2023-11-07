import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useCreateDefaultSponsorMetadata } from "@/hooks/useCreateDefaultSponsorMetadata";

interface CreateOrUpdateDefaultSponsorMetadataFormValues {
  address: string;
  type: string;
  companyName: string;
  firstName: string;
  lastName: string;
  image: string;
}
export const CreateOrUpdateDefaultSponsorMetadataForm = ({
  initialValues,
  onCompleted,
}: {
  initialValues?: CreateOrUpdateDefaultSponsorMetadataFormValues;
  onCompleted?: () => void;
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  });

  const { mutateAsync: createDefaultSponsorMetadata } =
    useCreateDefaultSponsorMetadata();
  const toast = useToast();

  const onSubmitted = async (
    values: CreateOrUpdateDefaultSponsorMetadataFormValues,
  ) => {
    try {
      await createDefaultSponsorMetadata({ data: values });
      toast({
        title: "Success",
        description: "Default sponsor metadata created",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onCompleted?.();
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Could not create default sponsor metadata",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmitted)}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            id="address"
            placeholder="Address"
            isDisabled={isSubmitting}
            {...register("address", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="type">Type</FormLabel>
          <Input
            id="type"
            placeholder="Type"
            isDisabled={isSubmitting}
            {...register("type", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="companyName">Company name</FormLabel>
          <Input
            id="companyName"
            placeholder="Company name"
            isDisabled={isSubmitting}
            {...register("companyName")}
          />
          <FormErrorMessage>{errors.companyName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="firstName">First name</FormLabel>
          <Input
            id="firstName"
            placeholder="First name"
            isDisabled={isSubmitting}
            {...register("firstName")}
          />
          <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="lastName">Last name</FormLabel>
          <Input
            id="lastName"
            placeholder="Last name"
            isDisabled={isSubmitting}
            {...register("lastName")}
          />
          <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="image">Image</FormLabel>
          <Input
            id="image"
            placeholder="Image"
            isDisabled={isSubmitting}
            {...register("image", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>
        <Button colorScheme="teal" isDisabled={isSubmitting} type={"submit"}>
          Submit
        </Button>
      </VStack>
    </form>
  );
};
