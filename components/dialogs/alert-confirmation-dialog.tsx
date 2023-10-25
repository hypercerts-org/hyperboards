import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FocusableElement } from "@chakra-ui/utils";
import { ModalProps } from "@chakra-ui/modal";

export function AlertDialog({
  onConfirm,
  isOpen,
  onClose,
  title,
}: { onConfirm: () => Promise<void>; title: string } & Omit<
  ModalProps,
  "children"
>) {
  const cancelRef = useRef<FocusableElement>(null);

  const onClickConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <ChakraAlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can{"'"}t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={onClickConfirm} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  );
}
