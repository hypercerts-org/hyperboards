import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { AiOutlineLink } from "react-icons/ai";
import { AlertDialog } from "@/components/dialogs/alert-confirmation-dialog";
import { useFetchMyHyperboards } from "@/hooks/useFetchMyHyperboards";
import { useRemoveRegistryFromHyperboard } from "@/hooks/useRemoveRegistryFromHyperboard";

export const RemoveRegistryFromHyperboardButton = ({
  hyperboardId,
  registryId,
  size = "md",
}: {
  hyperboardId: string;
  registryId: string;
  size?: string;
}) => {
  const { refetch } = useFetchMyHyperboards();
  const { onClose, onOpen, isOpen } = useDisclosure();

  const toast = useToast();
  const { mutateAsync: removeRegistryFromHyperboard } =
    useRemoveRegistryFromHyperboard();

  const onConfirm = async () => {
    try {
      await removeRegistryFromHyperboard({ hyperboardId, registryId });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not remove registry from hyperboard",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    await refetch();
    toast({
      title: "Success",
      description: "Registry removed from hyperboard",
      status: "success",
    });
  };

  return (
    <>
      <IconButton
        aria-label="Delete registry from hyperboard"
        icon={<AiOutlineLink />}
        colorScheme="red"
        onClick={onOpen}
        size={size}
      />
      <AlertDialog
        title="Delete registry from hyperboard"
        onConfirm={onConfirm}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
