import { ModalProps } from "@chakra-ui/modal";
import { GenericModal } from "@/components/GenericModal";
import { CreateOrUpdateBlueprintForm } from "@/components/forms/create-or-update-blueprint-form";

export const CreateBlueprintModal = ({
  registryId,
  ...modalProps
}: { registryId?: string } & Omit<ModalProps, "children">) => {
  return (
    <GenericModal title="Create Blueprint" {...modalProps}>
      <CreateOrUpdateBlueprintForm
        onComplete={modalProps.onClose}
        registryId={registryId}
      />
    </GenericModal>
  );
};
