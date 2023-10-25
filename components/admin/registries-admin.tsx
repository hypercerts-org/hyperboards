import {
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  IconButton,
  TableContainer,
  Td,
  Tr,
  Table,
  useDisclosure,
  VStack,
  Thead,
  Tbody,
  Th,
  Link,
} from "@chakra-ui/react";
import { useMyRegistries } from "@/hooks/useMyRegistries";
import { CreateRegistryModal } from "@/components/admin/create-registry-modal";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { CreateUpdateRegistryFormValues } from "@/components/forms/create-or-update-registry-form";
import { DeleteRegistryButton } from "@/components/admin/delete-registry-button";
import { ClaimEntity } from "@/types/database-entities";
import { useHypercertById } from "@/hooks/useHypercertById";
import { formatAddress } from "@/utils/formatting";
import { DeleteClaimButton } from "@/components/admin/delete-claim-button";

export const RegistriesAdmin = () => {
  const {
    isOpen: createIsOpen,
    onClose: createOnClose,
    onOpen: createOnOpen,
  } = useDisclosure();

  const { data } = useMyRegistries();

  const [selectedRegistry, setSelectedRegistry] =
    useState<CreateUpdateRegistryFormValues>();

  const onModalClose = () => {
    createOnClose();
    setSelectedRegistry(undefined);
  };

  return (
    <Flex direction={"column"} width={"100%"}>
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
            <VStack alignItems={"flex-start"}>
              <HStack justifyContent={"space-between"} width={"100%"}>
                <Heading>{registry.name}</Heading>
                <HStack>
                  <IconButton
                    onClick={() => {
                      setSelectedRegistry({
                        ...registry,
                        claims: registry.claims.map((claim) => ({
                          claim_id: claim.id,
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
              <TableContainer>
                <Table variant={"striped"} colorScheme="blue" size={"sm"}>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Chain</Th>
                      <Th>Owner</Th>
                      <Th>External url</Th>
                      <Th>Description</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {registry.claims.map((claim) => (
                      <ClaimRow key={claim.id} {...claim} />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
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

const ClaimRow = ({ hypercert_id, chain_id, id }: {} & ClaimEntity) => {
  const { data } = useHypercertById(hypercert_id);

  if (!data) {
    return <div>Hypercert not found</div>;
  }

  return (
    <Tr>
      <Td>
        <Link
          href={`https://hypercerts.org/app/view#claimId=${hypercert_id}`}
          target={"_blank"}
          textDecoration={"underline"}
        >
          {data.metadata.name}
        </Link>
      </Td>
      <Td>{chain_id}</Td>
      <Td>{formatAddress(data.owner)}</Td>
      <Td>
        <Link
          href={data.metadata.external_url}
          target={"_blank"}
          textDecoration={"underline"}
        >
          {data.metadata.external_url}
        </Link>
      </Td>
      <Td>{data.metadata.description}</Td>
      <Td>
        <DeleteClaimButton size="xs" claimId={id} />
      </Td>
    </Tr>
  );
};
