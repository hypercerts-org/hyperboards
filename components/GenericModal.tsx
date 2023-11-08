import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import { Flex, Modal } from "@chakra-ui/react";

export const GenericModal = ({
  title,
  children,
  width,
  ...modalProps
}: ModalProps & { title: string } & Pick<ModalContentProps, "width">) => {
  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent minW={width}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>{children}</Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
