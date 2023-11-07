import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { useFetchMyRegistries } from "@/hooks/useFetchMyRegistries";
import { AiFillDelete } from "react-icons/ai";
import { AlertDialog } from "@/components/dialogs/alert-confirmation-dialog";
import { useDeleteClaim } from "@/hooks/useDeleteClaim";

export const DeleteClaimButton = ({
  claimId,
  size = "md",
}: {
  claimId: string;
  size?: string;
}) => {
  const { refetch } = useFetchMyRegistries();
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
        size={size}
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
