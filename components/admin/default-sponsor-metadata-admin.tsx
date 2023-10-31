import { useFetchDefaultSponsorMetadata } from "@/hooks/useFetchDefaultSponsorMetadata";
import {
  Button,
  Card,
  Center,
  Flex,
  Heading,
  Spinner,
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
import { formatAddress } from "@/utils/formatting";
import { CreateOrUpdateDefaultSponsorMetadataModal } from "@/components/admin/create-or-update-default-sponsor-metadata-modal";

export const DefaultSponsorMetadataAdmin = () => {
  const { data, isLoading } = useFetchDefaultSponsorMetadata();
  const {
    isOpen: isOpenCreate,
    onClose: onCloseCreate,
    onOpen: onOpenCreate,
  } = useDisclosure();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Flex direction="column" width={"100%"}>
      <VStack alignItems={"flex-start"}>
        <Button onClick={onOpenCreate} colorScheme="blue">
          Create
        </Button>
        <Card width={"100%"}>
          {data?.data?.length ? (
            <TableContainer width={"100%"} height={"100%"}>
              <Table variant={"striped"} colorScheme="blue" size={"sm"}>
                <Thead>
                  <Tr>
                    <Th>Address</Th>
                    <Th>Type</Th>
                    <Th>Company name</Th>
                    <Th>First name</Th>
                    <Th>Last name</Th>
                    <Th>Image</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.data.map((defaultSponsorMetadata) => (
                    <Tr key={defaultSponsorMetadata.address}>
                      <Td>{formatAddress(defaultSponsorMetadata.address)}</Td>
                      <Td>{defaultSponsorMetadata.type}</Td>
                      <Td>{defaultSponsorMetadata.companyName}</Td>
                      <Td>{defaultSponsorMetadata.firstName}</Td>
                      <Td>{defaultSponsorMetadata.lastName}</Td>
                      <Td>
                        <a
                          href={defaultSponsorMetadata.image}
                          target={"_blank"}
                        >
                          {defaultSponsorMetadata.image}
                        </a>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Center p={4}>
              <Heading>No default sponsor metadata found</Heading>
            </Center>
          )}
        </Card>
      </VStack>
      <CreateOrUpdateDefaultSponsorMetadataModal
        isOpen={isOpenCreate}
        onClose={onCloseCreate}
      />
    </Flex>
  );
};
