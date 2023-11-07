import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { useFetchMyRegistries } from "@/hooks/useFetchMyRegistries";
import { AiFillDelete } from "react-icons/ai";
import { AlertDialog } from "@/components/dialogs/alert-confirmation-dialog";
import { useDeleteBlueprint } from "@/hooks/useDeleteBlueprint";

export const DeleteBlueprintButton = ({
  blueprintId,
  size = "sm",
}: {
  blueprintId: number;
  size?: string;
}) => {
  const { refetch } = useFetchMyRegistries();
  const { onClose, onOpen, isOpen } = useDisclosure();

  const toast = useToast();
  const { mutateAsync: deleteBlueprintAsync } = useDeleteBlueprint();

  const onDeleteBlueprint = async () => {
    try {
      await deleteBlueprintAsync(blueprintId);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not delete blueprint",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    await refetch();
    toast({
      title: "Success",
      description: "Blueprint deleted",
      status: "success",
    });
  };

  return (
    <>
      <IconButton
        size={size}
        aria-label="Delete blueprint"
        icon={<AiFillDelete />}
        colorScheme="red"
        onClick={onOpen}
      />
      <AlertDialog
        title="Delete Blueprint"
        onConfirm={() => onDeleteBlueprint()}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
