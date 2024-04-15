import {
  Button,
  ButtonProps,
  Flex,
  HStack,
  Modal,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useFetchMarketplaceOrdersForHypercert } from "@/hooks/marketplace/useFetchMarketplaceOrdersForHypercert";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { AvailableOrders } from "@/components/marketplace/available-orders";
import React from "react";
import { BalanceOverview } from "@/components/balance-overview";
import { useFetchHypercertById } from "@/hooks/useFetchHypercertById";
import { OwnershipStats } from "@/components/marketplace/ownership-stats";
import { useHypercertClient } from "@/components/providers";

type Props = {
  hypercertId: string;
  text?: string;
  onClickListForSale?: () => void;
} & ButtonProps;

export const BuyHypercertButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ hypercertId, text = "Buy", onClickListForSale, ...props }, ref) => {
    const { isOpen, onClose, onOpen } = useDisclosure({
      id: "buy-hypercert-button",
    });

    const client = useHypercertClient();

    const { data: orderData } =
      useFetchMarketplaceOrdersForHypercert(hypercertId);
    const { data: hypercert } = useFetchHypercertById(hypercertId);

    const [step, setStep] = React.useState<"buy" | "confirmation">("buy");
    const [boughtFractionId, setBoughtFractionId] = React.useState<string>();

    const onConfirmed = (fractionId: string) => {
      setBoughtFractionId(fractionId);
      setStep("confirmation");
    };

    const onClickBuyMore = () => {
      setBoughtFractionId(undefined);
      setStep("buy");
    };

    const boughtFraction = boughtFractionId
      ? orderData?.orders[boughtFractionId]
      : undefined;

    const disabled =
      !client ||
      !client.isClaimOrFractionOnConnectedChain(hypercertId) ||
      Object.keys(orderData?.orders ?? {}).length === 0;

    return (
      <>
        <Button
          variant="blackAndWhite"
          onClick={onOpen}
          ref={ref}
          isDisabled={disabled}
          {...props}
        >
          {text}
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent minW={"960px"} pb={4}>
            {step === "buy" && (
              <>
                <ModalHeader>
                  <Flex alignItems={"center"} mb={4}>
                    Select a fraction to buy
                    <Flex ml={"auto"} flexDirection={"column"}>
                      <Text
                        mb={2}
                        fontSize={"md"}
                        fontWeight={500}
                        opacity={0.5}
                      >
                        Available balance:
                      </Text>
                      <BalanceOverview />
                    </Flex>{" "}
                  </Flex>
                </ModalHeader>
                <ModalBody minW={"960px"}>
                  {orderData && (
                    <AvailableOrders
                      onBuyConfirmed={onConfirmed}
                      orders={Object.values(orderData.orders).map((x) => ({
                        ...x.order,
                        percentagePrice: x.pricePerPercent,
                        fractionSize: x.fraction?.percentage ?? 0,
                      }))}
                    />
                  )}
                </ModalBody>
              </>
            )}
            {step === "confirmation" && (
              <>
                <ModalCloseButton />
                <ModalBody pt={8}>
                  <VStack spacing={5}>
                    <Text fontWeight={500}>
                      You bought {boughtFraction?.fraction?.percentage}% of
                    </Text>
                    <Text fontSize={"xxl"} textStyle={"secondary"}>
                      {hypercert?.metadata.name}
                    </Text>
                    <VStack
                      width={"510px"}
                      border={"1px solid black"}
                      borderColor={"rgba(0, 0, 0, 0.2)"}
                      py={"28px"}
                      px={"20px"}
                      borderRadius={"8px"}
                    >
                      <OwnershipStats hypercertId={hypercertId} />
                      <HStack width={"100%"}>
                        <Button
                          variant="blackAndWhiteOutline"
                          border={"none"}
                          backgroundColor={"background"}
                          width={"100%"}
                          onClick={() => {
                            onClickListForSale?.();
                            setStep("buy");
                            onClose();
                          }}
                        >
                          List for sale
                        </Button>
                        <Button
                          variant="blackAndWhiteOutline"
                          border={"none"}
                          width={"100%"}
                          backgroundColor={"background"}
                        >
                          Transfer
                        </Button>
                      </HStack>
                    </VStack>
                    <Button
                      mt={20}
                      variant={"blackAndWhite"}
                      onClick={onClickBuyMore}
                    >
                      Buy more
                    </Button>
                  </VStack>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  },
);

BuyHypercertButton.displayName = "BuyHypercertButton";
