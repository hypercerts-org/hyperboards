import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { formatEther } from "viem";

import { MarketplaceOrderEntity } from "@/types/database-entities";
import { useBuyMakerBid } from "@/hooks/marketplace/useBuyMakerBid";
import { createColumnHelper } from "@tanstack/table-core";

import { DataTable } from "@/components/datatable";
import { formatAddress } from "@/utils/formatting";

type OrderTableEntity = MarketplaceOrderEntity & {
  fractionSize: number;
  percentagePrice: bigint;
};

export const AvailableOrders = ({ orders }: { orders: OrderTableEntity[] }) => {
  const { mutateAsync: buyFraction } = useBuyMakerBid();
  const toast = useToast();
  const columnHelper = createColumnHelper<OrderTableEntity>();
  const defaultColumns = [
    columnHelper.accessor("signer", {
      cell: (value) => formatAddress(value.getValue()),
      header: "Seller",
    }),
    columnHelper.accessor("fractionSize", {
      cell: (value) => `${value.getValue() * 100}%`,
      header: "Fraction size",
    }),
    columnHelper.accessor("percentagePrice", {
      cell: (value) => `${value.getValue() / 100n}%`,
      header: "Price per 1%",
    }),
    columnHelper.accessor("price", {
      cell: (value) => formatEther(BigInt(value.getValue())),
      header: "Fraction price",
    }),
  ];

  return (
    <>
      <DataTable data={orders} columns={defaultColumns} />
      <VStack>
        <Heading size={"md"}>Available orders</Heading>
        {orders.length ? (
          <TableContainer>
            <Table variant={"striped"} size={"sm"} colorScheme="blackAlpha">
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Order Type</Th>
                  <Th>Order Price</Th>
                  <Th>Created at</Th>
                  <Th>Collection</Th>
                  <Th>Token</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => {
                  const onBuy = async () => {
                    try {
                      await buyFraction({ order });
                    } catch (e) {
                      toast({
                        title: "Error",
                        description: (e as Error).message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      });
                    }
                  };
                  return (
                    <Tr key={order.id}>
                      <Td>{order.id}</Td>
                      <Td>{order.quoteType}</Td>
                      <Td>{formatEther(BigInt(order.price))}</Td>
                      <Td>{order.createdAt}</Td>
                      <Td>{order.collection}</Td>
                      <Td>{order.itemIds?.[0]}</Td>
                      <Td>
                        <Button colorScheme="teal" onClick={() => onBuy()}>
                          Buy
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Heading size={"md"}>No orders available</Heading>
        )}
      </VStack>
    </>
  );
};
