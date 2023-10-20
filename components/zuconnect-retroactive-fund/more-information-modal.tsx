import {
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import {
  Button,
  ListItem,
  Modal,
  OrderedList,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { SAFE_ADDRESS } from "@/components/zuconnect-retroactive-fund/index";

export const MoreInformationModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent borderRadius={0} minW={700}>
        <ModalBody p={8}>
          <VStack
            spacing={6}
            fontSize={"lg"}
            textUnderlineOffset={"2px"}
            alignItems={"flex-start"}
          >
            <Text textDecoration={"underline"} textAlign={"center"} w={"100%"}>
              Zuconnect Retroactive Fund
            </Text>
            <Text>
              <u>Goal:</u> We want to fund and reward the experiences that the
              community valued most
            </Text>
            <Text>
              <u>Steps</u>
              <br />
              <OrderedList spacing={2} mt={1}>
                <ListItem>Funders commit ETH to the retroactive fund</ListItem>
                <ListItem>
                  Contributors organize experiences at Zuconnect with the
                  potential of receiving funds retroactively
                </ListItem>
                <ListItem>
                  Contributors create hypercerts for each experience
                </ListItem>
                <ListItem> Zuconnect core team attest hypercerts</ListItem>
                <ListItem>Funders allocate their funds to hypercerts</ListItem>
                <ListItem>
                  Funders receive parts of the funded hypercerts
                </ListItem>
              </OrderedList>
            </Text>
            <Text>
              All funds that are not allocated by the funders directly, will be
              distributed as a <u>quadratic matching fund</u>.
            </Text>
            <Text>
              <u>Please note</u>
              <br />
              <UnorderedList spacing={2} mt={1}>
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
            </Text>
            <Text>
              <u>Safe to store funds</u>
              <UnorderedList spacing={2} mt={1}>
                <ListItem>Safe address: {SAFE_ADDRESS}</ListItem>
                <ListItem>Signer 1: xxx, Core organizer of Zuzalu</ListItem>
                <ListItem>
                  Signer 2: holke.eth (0x ....), Director of Hypercerts
                  Foundation
                </ListItem>
                <ListItem>Signer 3: xxx</ListItem>
              </UnorderedList>
            </Text>
            <Text>
              <u>Contact:</u> zuzalu [at] hypercerts.org
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
