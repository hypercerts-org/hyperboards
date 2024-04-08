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
import { EDGECITY_DONATION_SAFE_ADDRESS } from "@/config";

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
              <b>Edge City Denver Retroactive Funding</b>
            </Text>
            <Text>
              <b>Goal:</b> We fund and reward the experiences that contributed to the success of our event
            </Text>
            <Box>
              <Text>
                <b>Steps</b>
              </Text>
              <OrderedList spacing={2} mt={1}>
                <ListItem>Contributors organize experiences at Edge City Denver &#x2705;</ListItem>
                <ListItem>Funders observe the event and experiences &#x2705;</ListItem>
                <ListItem>
                  Contributors submit{" "}
                  <a
                    href="https://hypercerts.org/"
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                  >
                    hypercerts
                  </a>{" "}
                  to apply for retroactive funding &#x2705;
                </ListItem>
                <ListItem> Funders fund the retroactive fund, which is distributed to the contributors</ListItem>
                <ListItem>Funders receive parts of the collective hypercert for Edge City Denver</ListItem>
              </OrderedList>
            </Box>
            <Text>
            The funds will be distributed automatically to the contributions based 
            on a predetermined allocation - available on the detail view of the hypercerts. 
            If the caps of each hypercert is reached, the additional funds will be allocated 
            to Edge City.
            </Text>
            <Box>
              <Text pb={0} mb={0}>
                <b>Please note</b>
              </Text>
              <UnorderedList mt={1} spacing={2}>
                <ListItem>
                This fund is set up by the Edge City community for the  Edge City community: 
                If you are not connected to Edge City, please email us before committing funds.
                </ListItem>
                <ListItem>
                Please use a wallet that you have used to interact with Edge City before. 
                If that is not possible, please send an email to us after committing funds.
                </ListItem>
                <ListItem>The minimum contribution is 0.01 ETH to receive parts of the hypercert.</ListItem>
              </UnorderedList>
            </Box>
            <Box>
              <Text>
                <b>Multi-sig that stores the funds</b>
              </Text>
              <UnorderedList spacing={2} mt={1}>
                <ListItem>Address: {EDGECITY_DONATION_SAFE_ADDRESS}</ListItem>
                <ListItem>
                  Signers (2/3): edgevillage.eth, garysheng.eth, hypercerts.holke.eth
                </ListItem>
              </UnorderedList>
            </Box>
            <Text>
              <b>Contact:</b> team [at] hypercerts.org
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
