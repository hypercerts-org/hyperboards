import { Button, useDisclosure } from "@chakra-ui/react";
import { CreateOrUpdateHyperboardRegistryModal } from "@/components/admin/create-or-update-hyperboard-registry-modal";

export const AddHyperboardRegistryButton = ({
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
      <Button
        aria-label="Edit hyperboard registry"
        colorScheme="blue"
        onClick={onOpen}
        size={size}
      >
        Add registry to hyperboard
      </Button>
      <CreateOrUpdateHyperboardRegistryModal
        hyperboardId={hyperboardId}
        registryId={registryId}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
