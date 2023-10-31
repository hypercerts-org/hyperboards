import { GenericModal } from "@/components/GenericModal";
import { ModalProps } from "@chakra-ui/modal";
import { CreateOrUpdateDefaultSponsorMetadataForm } from "@/components/forms/create-or-update-default-sponsor-metadata-form";

export const CreateOrUpdateDefaultSponsorMetadataModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  return (
    <GenericModal title="Create default sponsor metadata" {...modalProps}>
      <CreateOrUpdateDefaultSponsorMetadataForm />
    </GenericModal>
  );
};
