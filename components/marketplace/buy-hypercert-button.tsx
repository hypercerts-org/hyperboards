import { Button, ButtonProps, Modal, useDisclosure } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { AvailableOrders } from "@/components/marketplace/available-orders";
import React from "react";

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
          <ModalContent minW={"960px"}>
            <ModalHeader>Buy Hypercert</ModalHeader>
            <ModalBody minW={"960px"}>
              {orderData && (
                <AvailableOrders
                  orders={Object.values(orderData.orders).map((x) => ({
                    ...x.order,
                    percentagePrice: 1n,
                    fractionSize: 0.2,
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
