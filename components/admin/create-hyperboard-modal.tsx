import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import { Button, Flex, Modal, useToast } from "@chakra-ui/react";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useAddress } from "@/hooks/useAddress";

export const CreateHyperboardModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  const getClient = useGetAuthenticatedClient();
  const address = useAddress();
  const toast = useToast();

  const onConfirm = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "You must be connected to create a hyperboard",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const supabase = await getClient();

    if (!supabase) {
      return;
    }

    const { error } = await supabase
      .from("hyperboards")
      .insert({
        name: "test",
        admin_id: address,
      })
      .select();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Hyperboard created",
      status: "success",
    });

    modalProps.onClose();
  };

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Hyperboard</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Button onClick={onConfirm}>Confirm</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
