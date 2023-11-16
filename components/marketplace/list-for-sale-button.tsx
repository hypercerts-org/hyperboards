import { Button, ButtonProps, Modal, useDisclosure } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import { ModalBody, ModalContent, ModalHeader } from "@chakra-ui/modal";
import { CreateOrderForm } from "@/components/marketplace/create-order-form";

export const ListForSaleButton = ({
  hypercertId,
  text = "List for sale",
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
          <ModalHeader>Sell fraction</ModalHeader>
          <ModalBody>
            {orderData && <CreateOrderForm hypercertId={hypercertId} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
