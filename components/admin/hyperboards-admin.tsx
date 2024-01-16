import {
  Button,
  Card,
  Center,
  Flex,
  Heading,
  HStack,
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
import { useFetchMyHyperboards } from "@/hooks/useFetchMyHyperboards";
import { DeleteHyperboardButton } from "@/components/admin/delete-hyperboard-button";
import { RemoveRegistryFromHyperboardButton } from "@/components/admin/remove-registry-from-hyperboard-button";
import { EditHyperboardRegistryButton } from "@/components/admin/edit-hyperboard-registry-button";
import { AddHyperboardRegistryButton } from "@/components/admin/add-hyperboard-registry-button";
import { headerHeight } from "@/components/layout/header";
import { formatRenderMethodReadableName } from "@/utils/formatting";

export const HyperboardsAdmin = () => {
  const {
    isOpen: createIsOpen,
    onClose: createOnClose,
    onOpen: createOnOpen,
  } = useDisclosure();

  const { data } = useFetchMyHyperboards();

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
            {!!hyperboard.hyperboard_registries.length && (
              <TableContainer>
                <Table variant={"striped"} size={"sm"} colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Label</Th>
                      <Th>Render method</Th>
                      <Th>Chain ID</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {hyperboard.hyperboard_registries.map(
                      (hyperboardRegistry) => {
                        if (!hyperboardRegistry.registries) return null;
                        const registry = hyperboardRegistry.registries;
                        return (
                          <Tr key={registry.id}>
                            <Td>{registry.name}</Td>
                            <Td>{hyperboardRegistry.label}</Td>
                            <Td>
                              {formatRenderMethodReadableName(
                                hyperboardRegistry.render_method,
                              )}
                            </Td>
                            <Td>{registry.chain_id}</Td>
                            <Td>
                              <HStack justifyContent={"end"}>
                                <EditHyperboardRegistryButton
                                  size={"sm"}
                                  hyperboardId={hyperboard.id}
                                  registryId={registry.id}
                                />
                                <RemoveRegistryFromHyperboardButton
                                  size={"sm"}
                                  hyperboardId={hyperboard.id}
                                  registryId={registry.id}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        );
                      },
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            <Center mt={2}>
              <AddHyperboardRegistryButton hyperboardId={hyperboard.id} />
            </Center>
          </Card>
        ))}
      </VStack>
      <CreateHyperboardModal isOpen={createIsOpen} onClose={createOnClose} />
    </Flex>
  );
};
