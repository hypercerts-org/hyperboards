import { IconButton, useDisclosure } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { CreateOrUpdateDefaultSponsorMetadataModal } from "@/components/admin/create-or-update-default-sponsor-metadata-modal";

export const EditDefaultSponsorMetadataButton = ({
  sponsorAddress,
  size,
}: {
  sponsorAddress?: string;
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
      <CreateOrUpdateDefaultSponsorMetadataModal
        sponsorAddress={sponsorAddress}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};
