import { ModalProps } from "@chakra-ui/modal";
import { GenericModal } from "@/components/GenericModal";
import { CreateOrUpdateHyperboardRegistryForm } from "@/components/forms/create-or-update-hyperboard-registry-form";

export const CreateOrUpdateHyperboardRegistryModal = ({
  hyperboardId,
  registryId,
  ...modalProps
}: {
  registryId?: string;
  hyperboardId: string;
} & Omit<ModalProps, "children">) => {
  return (
    <GenericModal title="Edit hyperboard<>registry connection" {...modalProps}>
      <CreateOrUpdateHyperboardRegistryForm
        hyperboardId={hyperboardId}
        onComplete={modalProps.onClose}
        registryId={registryId}
      />
    </GenericModal>
  );
};
