import {
  Button,
  ButtonProps,
  Flex,
  Modal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { AvailableOrders } from "@/components/marketplace/available-orders";
import React from "react";
import { BalanceOverview } from "@/components/balance-overview";

type Props = {
  hypercertId: string;
  text?: string;
} & ButtonProps;

export const BuyHypercertButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ hypercertId, text = "Buy", ...props }, ref) => {
    const { isOpen, onClose, onOpen } = useDisclosure({
      defaultIsOpen: true,
    });

    const { data: orderData } =
      useFetchMarketplaceOrdersForHypercert(hypercertId);

    return (
      <>
        <Button variant="blackAndWhite" onClick={onOpen} ref={ref} {...props}>
          {text}
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent minW={"960px"} pb={4}>
            <ModalHeader>
              <Flex alignItems={"center"} mb={4}>
                Select a fraction to buy
                <Flex ml={"auto"} flexDirection={"column"}>
                  <Text mb={2} fontSize={"md"} fontWeight={500} opacity={0.5}>
                    Available balance:
                  </Text>
                  <BalanceOverview />
                </Flex>{" "}
              </Flex>
            </ModalHeader>
            <ModalBody minW={"960px"}>
              {orderData && (
                <AvailableOrders
                  orders={Object.values(orderData.orders).map((x) => ({
                    ...x.order,
                    percentagePrice: x.pricePerPercent,
                    fractionSize: x.fraction?.percentage ?? 0,
                  }))}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  },
);

BuyHypercertButton.displayName = "BuyHypercertButton";
