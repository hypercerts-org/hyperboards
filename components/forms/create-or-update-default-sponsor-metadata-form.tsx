import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useCreateDefaultSponsorMetadata } from "@/hooks/useCreateDefaultSponsorMetadata";
import { useFetchDefaultSponsorMetadataByAddress } from "@/hooks/useFetchDefaultSponsorMetadataByAddress";
import React, { useEffect } from "react";
import { useUpdateDefaultSponsorMetadata } from "@/hooks/useUpdateDefaultSponsorMetadata";
import { Tile } from "@/components/hyperboard/Tile";
import { HyperboardEntry } from "@/types/Hyperboard";

interface CreateOrUpdateDefaultSponsorMetadataFormValues {
  address: string | null;
  type: string | null;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
}

const defaultPreviewValues: HyperboardEntry = {
  id: "a",
  value: 1n,
  image: "https://via.placeholder.com/100",
  companyName: "Company name",
  type: "Test",
  firstName: "First",
  lastName: "Last",
};

const previewSize = 120;

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrUpdateDefaultSponsorMetadataFormValues>({});

  const allValues = watch();

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

  // @ts-ignore
  const hyperboardEntry: HyperboardEntry = {
    ...defaultPreviewValues,
    ...allValues,
  };

  // TODO: Add preview of rendering of different tiles
  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmitted)}>
      <HStack>
        <VStack spacing={4} minW={[0, 0, "300px"]}>
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
        <VStack
          spacing={4}
          width={"200px"}
          minW={[0, 0, "200px"]}
          alignItems={"center"}
        >
          <Text fontSize={"lg"} fontWeight={600} textAlign={"center"}>
            Preview
          </Text>
          <Text fontSize={"md"} fontWeight={600} textAlign={"center"}>
            Full
          </Text>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            height={previewSize + 2}
            width={previewSize + 2}
            backgroundColor={"black"}
          >
            <Box position={"relative"} width={previewSize} height={previewSize}>
              {/*
            //@ts-ignore */}
              <Tile
                entry={hyperboardEntry}
                width={previewSize}
                height={previewSize}
                top={0}
                left={0}
                padding={0}
              />
            </Box>
          </Flex>
          <Text fontSize={"md"} fontWeight={600} textAlign={"center"}>
            Image only
          </Text>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            height={previewSize + 2}
            width={previewSize + 2}
            backgroundColor={"black"}
          >
            <Box position={"relative"} width={previewSize} height={previewSize}>
              {/*
            //@ts-ignore */}
              <Tile
                entry={hyperboardEntry}
                width={previewSize}
                height={previewSize}
                top={0}
                left={0}
                padding={0}
              />
            </Box>
          </Flex>
        </VStack>
      </HStack>
    </form>
  );
};
