import { IconButton, useDisclosure } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { CreateOrUpdateHyperboardRegistryModal } from "@/components/admin/create-or-update-hyperboard-registry-modal";

export const EditHyperboardRegistryButton = ({
  hyperboardId,
  registryId,
  size,
}: {
  hyperboardId: string;
  registryId?: string;
  size?: string;
}) => {
  const { onClose, onOpen, isOpen } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Edit hyperboard registry"
        icon={<AiFillEdit />}
        colorScheme="blue"
        onClick={onOpen}
        size={size}
      />
      <CreateOrUpdateHyperboardRegistryModal
        hyperboardId={hyperboardId}
        registryId={registryId}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
