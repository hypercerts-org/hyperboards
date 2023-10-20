import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { useMyRegistries } from "@/hooks/useMyRegistries";
import { AiFillDelete } from "react-icons/ai";
import { AlertDialog } from "@/components/dialogs/AlertConfirmationDialog";
import { useDeleteClaim } from "@/hooks/useDeleteClaim";

export const DeleteClaimButton = ({ claimId }: { claimId: string }) => {
  const { refetch } = useMyRegistries();
  const { onClose, onOpen, isOpen } = useDisclosure();

  const toast = useToast();
  const { mutateAsync: deleteClaimAsync } = useDeleteClaim();

  const onDeleteClaim = async (claimId: string) => {
    try {
      await deleteClaimAsync(claimId);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not delete claim",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    await refetch();
    toast({
      title: "Success",
      description: "Claim deleted",
      status: "success",
    });
  };

  return (
    <>
      <IconButton
        aria-label="Delete claim"
        icon={<AiFillDelete />}
        colorScheme="red"
        onClick={onOpen}
      />
      <AlertDialog
        title="Delete claim"
        onConfirm={() => onDeleteClaim(claimId)}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
