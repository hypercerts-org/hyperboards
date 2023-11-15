import { Button, ButtonProps, Modal, useDisclosure } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import { ModalBody, ModalContent, ModalHeader } from "@chakra-ui/modal";
import { AvailableOrders } from "@/components/marketplace/available-orders";

export const BuyHypercertButton = ({
  hypercertId,
  text = "Buy",
  ...props
}: {
  hypercertId: string;
  text?: string;
} & ButtonProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: orderData } =
    useFetchMarketplaceOrdersForHypercert(hypercertId);
  return (
    <>
      <Button variant="blackAndWhite" onClick={onOpen} {...props}>
        {text}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Buy Hypercert</ModalHeader>
          <ModalBody>
            {orderData && (
              <AvailableOrders
                orders={Object.values(orderData.orders).map((x) => x.order)}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
