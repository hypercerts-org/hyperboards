import {
  Button,
  Card,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { CreateHyperboardModal } from "@/components/admin/create-hyperboard-modal";
import { useMyHyperboards } from "@/hooks/useMyHyperboards";
import { DeleteHyperboardButton } from "@/components/admin/delete-hyperboard-button";
import { RemoveRegistryFromHyperboardButton } from "@/components/admin/remove-registry-from-hyperboard-button";
import { headerHeight } from "@/components/Layout";

export const HyperboardsAdmin = () => {
  const {
    isOpen: createIsOpen,
    onClose: createOnClose,
    onOpen: createOnOpen,
  } = useDisclosure();

  const { data } = useMyHyperboards();

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      minHeight={`calc(100vh - ${headerHeight}`}
    >
      <VStack spacing={4} alignItems={"flex-start"} width={"100%"}>
        <Button
          variant={"solid"}
          size={"md"}
          colorScheme="blue"
          onClick={createOnOpen}
        >
          Create Hyperboard
        </Button>
        {data?.data?.map((hyperboard) => (
          <Card width={"100%"} key={hyperboard.id} p={4}>
            <Flex justifyContent={"space-between"}>
              <Heading>{hyperboard.name}</Heading>
              <DeleteHyperboardButton hyperboardId={hyperboard.id} />
            </Flex>
            {!!hyperboard.registries.length && (
              <TableContainer>
                <Table variant={"striped"} size={"sm"} colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {hyperboard.registries.map((registry) => (
                      <Tr key={registry.id}>
                        <Td>{registry.name}</Td>
                        <Td>
                          <RemoveRegistryFromHyperboardButton
                            size={"sm"}
                            hyperboardId={hyperboard.id}
                            registryId={registry.id}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Card>
        ))}
      </VStack>
      <CreateHyperboardModal isOpen={createIsOpen} onClose={createOnClose} />
    </Flex>
  );
};
