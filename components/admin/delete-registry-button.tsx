import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { useDeleteRegistry } from "@/hooks/useDeleteRegistry";
import { useFetchMyRegistries } from "@/hooks/useFetchMyRegistries";
import { AiFillDelete } from "react-icons/ai";
import { AlertDialog } from "@/components/dialogs/alert-confirmation-dialog";

export const DeleteRegistryButton = ({
  registryId,
}: {
  registryId: string;
}) => {
  const { refetch } = useFetchMyRegistries();
  const { onClose, onOpen, isOpen } = useDisclosure();

  const toast = useToast();
  const { mutateAsync: deleteRegistryAsync } = useDeleteRegistry();

  const onDeleteRegistry = async (registryId: string) => {
    try {
      await deleteRegistryAsync(registryId);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not delete registry",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    await refetch();
    toast({
      title: "Success",
      description: "Registry deleted",
      status: "success",
    });
  };

  return (
    <>
      <IconButton
        aria-label="Delete registry"
        icon={<AiFillDelete />}
        colorScheme="red"
        onClick={onOpen}
      />
      <AlertDialog
        title="Delete Registry"
        onConfirm={() => onDeleteRegistry(registryId)}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
