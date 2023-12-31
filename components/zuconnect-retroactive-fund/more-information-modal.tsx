import {
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import {
  Box,
  Button,
  ListItem,
  Modal,
  OrderedList,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ZUZALU_DONATION_SAFE_ADDRESS } from "@/config";

export const MoreInformationModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const hasRef = !!ref.current;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!hasRef) {
      return;
    }
    if (modalProps.isOpen) {
      window.document.body.scroll(0, 0);
      ref.current.scrollTop = 0;
    }
  }, [modalProps.isOpen, hasRef]);

  return (
    <Modal {...modalProps} size={isMobile ? "full" : undefined}>
      <ModalOverlay />
      <ModalContent ref={ref} borderRadius={0} minW={isMobile ? "100%" : 700}>
        <ModalBody p={8}>
          <VStack
            spacing={6}
            textUnderlineOffset={"2px"}
            alignItems={"flex-start"}
          >
            <Text textDecoration={"underline"} textAlign={"center"} w={"100%"}>
              <b>ZuConnect Retroactive Fund</b>
            </Text>
            <Text>
              <b>Goal:</b> We fund and reward the experiences that the community
              valued most
            </Text>
            <Box>
              <Text>
                <b>Steps</b>
              </Text>
              <OrderedList spacing={2} mt={1}>
                <ListItem>Funders commit ETH to the retroactive fund</ListItem>
                <ListItem>
                  Contributors organize experiences at ZuConnect with the
                  potential of receiving funds retroactively
                </ListItem>
                <ListItem>
                  Contributors create{" "}
                  <a
                    href="https://hypercerts.org/"
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                  >
                    hypercerts
                  </a>{" "}
                  for each experience
                </ListItem>
                <ListItem> Zuconnect core team attests hypercerts</ListItem>
                <ListItem>Funders allocate their funds to hypercerts</ListItem>
                <ListItem>
                  Funders receive parts of the funded hypercerts
                </ListItem>
              </OrderedList>
            </Box>
            <Text>
              All funds that are not allocated by the funders directly, will be
              distributed as a{" "}
              <a
                href="https://www.radicalxchange.org/concepts/plural-funding/"
                target="_blank"
                style={{ textDecoration: "underline" }}
              >
                quadratic matching fund
              </a>
              .
            </Text>
            <Box>
              <Text pb={0} mb={0}>
                <b>Please note</b>
              </Text>
              <UnorderedList mt={1} spacing={2}>
                <ListItem>
                  This fund is set up by the Zuzalu community for the Zuzalu
                  community: If you are not connected to Zuzalu, please email us
                  before committing funds.
                </ListItem>
                <ListItem>
                  Please use a wallet that you have used to interact with Zuzalu
                  before. If that is not possible, please send an email to us
                  after committing funds.
                </ListItem>
                <ListItem>The minimum contribution is 0.01 ETH.</ListItem>
              </UnorderedList>
            </Box>
            <Box>
              <Text>
                <b>Multi-sig that stores the funds</b>
              </Text>
              <UnorderedList spacing={2} mt={1}>
                <ListItem>Address: {ZUZALU_DONATION_SAFE_ADDRESS}</ListItem>
                <ListItem>
                  Signer 1: Vitalik Buterin, vitalik.eth,
                  0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
                </ListItem>
                <ListItem>
                  Signer 2: Janine Ledger (Core organizer, Zuzalu),
                  0x510e221C48ee37DAfc0d3802b43679Cf5d78561f
                </ListItem>
                <ListItem>
                  Signer 3: Gary Sheng (Community organizer, Zuzalu),
                  0x2a81C13F9366395c8FD1EA24912294230d062Db3
                </ListItem>
                <ListItem>
                  Signer 4: Holke Brammer, hypercerts.holke.eth, (Director,
                  Hypercerts Foundation),
                  0x676703E18b2d03Aa36d6A3124B4F58716dBf61dB
                </ListItem>
              </UnorderedList>
            </Box>
            <Text>
              <b>Contact:</b> zuzalu [at] hypercerts.org
            </Text>
            <Button
              mx={"auto"}
              onClick={modalProps.onClose}
              bg={"#41645F"}
              color={"white"}
            >
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
