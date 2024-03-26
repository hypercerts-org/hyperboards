import {
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import { HStack, Modal, Spinner, Text } from "@chakra-ui/react";

export const AwaitTransactionModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  return (
    <Modal {...modalProps} closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent borderRadius={0}>
        <ModalBody p={8}>
          <HStack justifyContent={"center"}>
            <Spinner />
            <Text fontSize={"lg"}>Waiting for transaction</Text>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
