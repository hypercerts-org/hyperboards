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
    formState: { errors },
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitted)}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            id="address"
            placeholder="Address"
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
            {...register("companyName")}
          />
          <FormErrorMessage>{errors.companyName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="firstName">First name</FormLabel>
          <Input
            id="firstName"
            placeholder="First name"
            {...register("firstName")}
          />
          <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="lastName">Last name</FormLabel>
          <Input
            id="lastName"
            placeholder="Last name"
            {...register("lastName")}
          />
          <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="image">Image</FormLabel>
          <Input
            id="image"
            placeholder="Image"
            {...register("image", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>
      </VStack>
      <Button type={"submit"}>Submit</Button>
    </form>
  );
};
