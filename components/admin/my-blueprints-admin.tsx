import {
  Card,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useMyBlueprints } from "@/hooks/useMyBlueprints";
import { formatAddress } from "@/utils/formatting";
import Link from "next/link";
import { useRouter } from "next/router";
import { BlueprintMinter } from "@/components/minting/blueprint-minter";

export const MyBlueprintsAdmin = () => {
  const { data, isLoading } = useMyBlueprints();
  const { query, push } = useRouter();

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return null;
  }

  const blueprintId = query["blueprintId"];
  const parsedBluePrintId = parseInt(blueprintId as string);

  return (
    <Flex direction={"column"} width={"100%"}>
      <VStack minHeight={"100%"} spacing={4} alignItems={"flex-start"}>
        <Card p={4} w={"100%"}>
          {blueprintId ? (
            <BlueprintMinter
              blueprintId={parsedBluePrintId}
              onComplete={() => push("/admin/my-claims/")}
            />
          ) : (
            <TableContainer width={"100%"} height={"100%"}>
              <Table variant={"striped"} colorScheme="blue" size={"sm"}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Registry</Th>
                    <Th>Created on</Th>
                    <Th>Created by</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.data?.map((blueprint) => (
                    <Tr key={blueprint.id}>
                      {/*
                  // @ts-ignore */}
                      <Td>{blueprint.form_values?.name}</Td>
                      <Td>{blueprint.registries?.name}</Td>
                      <Td>{new Date(blueprint.created_at).toLocaleString()}</Td>
                      <Td>{formatAddress(blueprint.admin_id)}</Td>
                      <Td textDecoration={"underline"}>
                        <Link
                          href={{
                            href: "/admin/blueprints",
                            pathname: "/admin/my-blueprints",
                            query: {
                              blueprintId: blueprint.id,
                            },
                          }}
                        >
                          Mint
                        </Link>{" "}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </VStack>
    </Flex>
  );
};
