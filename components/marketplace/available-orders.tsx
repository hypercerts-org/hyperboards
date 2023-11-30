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

export const AvailableOrders = ({
  orders,
}: {
  orders: MarketplaceOrderEntity[];
}) => {
  const { mutateAsync: buyFraction } = useBuyMakerBid();
  const toast = useToast();

  return (
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
  );
};
