import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import { Flex, Modal } from "@chakra-ui/react";

export const GenericModal = ({
  title,
  children,
  ...modalProps
}: ModalProps & { title: string }) => {
  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>{children}</Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
