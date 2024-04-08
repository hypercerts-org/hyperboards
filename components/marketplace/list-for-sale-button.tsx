import {
  Button,
  ButtonProps,
  Modal,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { CreateOrderForm } from "@/components/marketplace/create-order-form";
import React from "react";
import { CreateFractionalOrderForm } from "@/components/marketplace/create-fractional-order-form";
import { useHypercertClient } from "@/components/providers";
import { useChainId } from "wagmi";

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

    const client = useHypercertClient();
    const chainId = useChainId();

    const disabled =
      !client || !client.isClaimOrFractionOnConnectedChain(hypercertId);

    return (
      <>
        <Button
          ref={ref}
          disabled={disabled}
          variant="blackAndWhite"
          onClick={onClickButton}
          {...props}
        >
          {text}
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent maxH={"80vh"} overflow={"auto"}>
            <ModalCloseButton size={"lg"} />
            <ModalBody p="40px" pt={"60px"}>
              <Tabs>
                <TabList>
                  <Tab>Direct sale</Tab>
                  <Tab>Fractional sale</Tab>
                </TabList>
                {orderData && (
                  <TabPanels>
                    <TabPanel>
                      <CreateOrderForm
                        hypercertId={hypercertId}
                        onClickViewListings={onClickViewListingsWithModalClose}
                      />
                    </TabPanel>
                    <TabPanel>
                      <CreateFractionalOrderForm hypercertId={hypercertId} />
                    </TabPanel>
                  </TabPanels>
                )}
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  },
);

ListForSaleButton.displayName = "ListForSaleButton";
