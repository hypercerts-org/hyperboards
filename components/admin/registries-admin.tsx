import {
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useMyRegistries } from "@/hooks/useMyRegistries";
import { CreateRegistryModal } from "@/components/admin/create-registry-modal";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { CreateUpdateRegistryFormValues } from "@/components/forms/CreateOrUpdateRegistryForm";
import { DeleteRegistryButton } from "@/components/admin/delete-registry-button";

export const RegistriesAdmin = () => {
  const {
    isOpen: createIsOpen,
    onClose: createOnClose,
    onOpen: createOnOpen,
  } = useDisclosure();

  const { data, refetch } = useMyRegistries();

  const [selectedRegistry, setSelectedRegistry] =
    useState<CreateUpdateRegistryFormValues>();

  const onModalClose = () => {
    createOnClose();
    setSelectedRegistry(undefined);
  };

  return (
    <Flex direction={"column"}>
      <VStack minHeight={"100%"} spacing={4} alignItems={"flex-start"}>
        <Button
          variant={"solid"}
          size={"md"}
          colorScheme="blue"
          onClick={createOnOpen}
        >
          Create Registry
        </Button>
        {data?.data?.map((registry) => (
          <Card key={registry.id} p={4} width={"100%"}>
            <HStack justifyContent={"space-between"}>
              <VStack alignItems={"flex-start"}>
                <Heading>{registry.name}</Heading>
                {registry.claims.map((claim) => (
                  <Heading key={claim.id} size={"sm"}>
                    {claim.hypercert_id}
                  </Heading>
                ))}
              </VStack>
              <HStack>
                <IconButton
                  onClick={() => {
                    setSelectedRegistry({
                      ...registry,
                      claims: registry.claims.map((claim) => ({
                        hypercert_id: claim.hypercert_id,
                      })),
                    });
                    createOnOpen();
                  }}
                  aria-label="Edit registry"
                  icon={<AiFillEdit />}
                />
                <DeleteRegistryButton registryId={registry.id} />
              </HStack>
            </HStack>
          </Card>
        ))}
      </VStack>
      <CreateRegistryModal
        isOpen={createIsOpen}
        onClose={onModalClose}
        initialValues={selectedRegistry}
      />
    </Flex>
  );
};
