import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";
import { AlertDialog } from "@/components/dialogs/AlertConfirmationDialog";
import { useMyHyperboards } from "@/hooks/useMyHyperboards";
import { useDeleteHyperboard } from "@/hooks/useDeleteHyperboard";

export const DeleteHyperboardButton = ({
  hyperboardId,
}: {
  hyperboardId: string;
}) => {
  const { refetch } = useMyHyperboards();
  const { onClose, onOpen, isOpen } = useDisclosure();

  const toast = useToast();
  const { mutateAsync: deleteHyperboardAsync } = useDeleteHyperboard();

  const onDeleteHyperboard = async (hyperboardId: string) => {
    try {
      await deleteHyperboardAsync(hyperboardId);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not delete hyperboard",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    await refetch();
    toast({
      title: "Success",
      description: "Hyperboard deleted",
      status: "success",
    });
  };

  return (
    <>
      <IconButton
        aria-label="Delete hyperboard"
        icon={<AiFillDelete />}
        colorScheme="red"
        onClick={onOpen}
      />
      <AlertDialog
        title="Delete Hyperboard"
        onConfirm={() => onDeleteHyperboard(hyperboardId)}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
