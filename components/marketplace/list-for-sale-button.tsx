import { Button, ButtonProps, Modal, useDisclosure } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { CreateOrderForm } from "@/components/marketplace/create-order-form";

export const ListForSaleButton = ({
  hypercertId,
  text = "List for sale",
  onClickViewListings,
  ...props
}: {
  hypercertId: string;
  text?: string;
  onClickViewListings?: () => void;
} & ButtonProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: orderData } =
    useFetchMarketplaceOrdersForHypercert(hypercertId);

  const onClickViewListingsWithModalClose = () => {
    onClose();
    onClickViewListings?.();
  };

  return (
    <>
      <Button variant="blackAndWhite" onClick={onOpen} {...props}>
        {text}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size={"lg"} />
          <ModalBody p="40px" pt={"60px"}>
            {orderData && (
              <CreateOrderForm
                hypercertId={hypercertId}
                onClickViewListings={onClickViewListingsWithModalClose}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
