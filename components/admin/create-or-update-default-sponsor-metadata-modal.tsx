import { GenericModal } from "@/components/GenericModal";
import { ModalProps } from "@chakra-ui/modal";
import { CreateOrUpdateDefaultSponsorMetadataForm } from "@/components/forms/create-or-update-default-sponsor-metadata-form";

export const CreateOrUpdateDefaultSponsorMetadataModal = ({
  sponsorAddress,
  ...modalProps
}: Omit<ModalProps, "children"> & { sponsorAddress?: string }) => {
  return (
    <GenericModal
      title={`${sponsorAddress ? "Update" : "Create"} default sponsor metadata`}
      width={"fit-content"}
      {...modalProps}
    >
      <CreateOrUpdateDefaultSponsorMetadataForm
        sponsorAddress={sponsorAddress}
        onCompleted={() => modalProps.onClose()}
      />
    </GenericModal>
  );
};
