import {
  Card,
  Flex,
  Heading,
  TableContainer,
  Tr,
  Table,
  VStack,
  Thead,
  Tbody,
  Th,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useMyClaims } from "@/hooks/useMyClaims";
import { ClaimRow } from "@/components/admin/registries-admin";

export const MyClaimsAdmin = () => {
  const { data, isLoading } = useMyClaims();

  if (isLoading) {
    return <Spinner />;
  }

  const myClaims = data?.data;

  return (
    <Flex direction={"column"} width={"100%"}>
      <VStack minHeight={"100%"} spacing={4} alignItems={"flex-start"}>
        <Card width={"100%"}>
          {myClaims?.length ? (
            <TableContainer width={"100%"}>
              <Table variant={"striped"} colorScheme="blue" size={"sm"}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Chain</Th>
                    <Th>Admin</Th>
                    <Th>External url</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {myClaims.map((claim) => (
                    <ClaimRow key={claim.id} {...claim} />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Center p={4}>
              <Heading>No claims found</Heading>
            </Center>
          )}
        </Card>
      </VStack>
    </Flex>
  );
};
