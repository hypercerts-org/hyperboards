import { Button, ButtonProps, Modal, useDisclosure } from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { CreateOrderForm } from "@/components/marketplace/create-order-form";
import React from "react";

type Props = {
  hypercertId: string;
  text?: string;
  onClickViewListings?: () => void;
  onClick?: () => void;
} & ButtonProps;

export const ListForSaleButton = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      hypercertId,
      text = "List for sale",
      onClickViewListings,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { isOpen, onClose, onOpen } = useDisclosure({
      id: "list-for-sale-button",
    });
    const { data: orderData } =
      useFetchMarketplaceOrdersForHypercert(hypercertId);

    const onClickViewListingsWithModalClose = () => {
      onClose();
      onClickViewListings?.();
    };

    const onClickButton = () => {
      onClick?.();
      onOpen();
    };

    return (
      <>
        <Button
          ref={ref}
          variant="blackAndWhite"
          onClick={onClickButton}
          {...props}
        >
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
  },
);

ListForSaleButton.displayName = "ListForSaleButton";
