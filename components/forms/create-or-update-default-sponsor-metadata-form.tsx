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
import { useFetchDefaultSponsorMetadataByAddress } from "@/hooks/useFetchDefaultSponsorMetadataByAddress";
import { useEffect } from "react";
import { useUpdateDefaultSponsorMetadata } from "@/hooks/useUpdateDefaultSponsorMetadata";

interface CreateOrUpdateDefaultSponsorMetadataFormValues {
  address: string | null;
  type: string | null;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
}
export const CreateOrUpdateDefaultSponsorMetadataForm = ({
  sponsorAddress,
  onCompleted,
}: {
  sponsorAddress?: string;
  onCompleted?: () => void;
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrUpdateDefaultSponsorMetadataFormValues>({});

  const { data } = useFetchDefaultSponsorMetadataByAddress(sponsorAddress);

  useEffect(() => {
    if (!data?.data) {
      return;
    }
    reset(data?.data);
  }, [data]);

  const { mutateAsync: createDefaultSponsorMetadata } =
    useCreateDefaultSponsorMetadata();
  const { mutateAsync: updateDefaultSponsorMetadata } =
    useUpdateDefaultSponsorMetadata();
  const toast = useToast();

  const onSubmitted = async ({
    address,
    image,
    type,
    ...values
  }: CreateOrUpdateDefaultSponsorMetadataFormValues) => {
    if (!address || !image || !type) {
      return;
    }

    if (sponsorAddress) {
      try {
        await updateDefaultSponsorMetadata({
          data: {
            type,
            address,
            image,
            ...values,
          },
        });
        toast({
          title: "Success",
          description: "Default sponsor metadata updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onCompleted?.();
      } catch (e) {
        console.log(e);
        toast({
          title: "Error",
          description: "Could not update default sponsor metadata",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      return;
    }

    try {
      await createDefaultSponsorMetadata({
        data: {
          type,
          address,
          image,
          ...values,
        },
      });
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
