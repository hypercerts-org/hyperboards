import { ModalProps } from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/react";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useAddress } from "@/hooks/useAddress";
import { GenericModal } from "@/components/GenericModal";
import { useMyRegistries } from "@/hooks/useMyRegistries";
import { ClaimInsert } from "@/types/database-entities";
import {
  CreateOrUpdateRegistryForm,
  CreateUpdateRegistryFormValues,
} from "@/components/forms/create-or-update-registry-form";
import { useChainId } from "wagmi";

export const CreateRegistryModal = ({
  initialValues,
  ...modalProps
}: Omit<ModalProps, "children"> & {
  initialValues: CreateUpdateRegistryFormValues | undefined;
}) => {
  const getClient = useGetAuthenticatedClient();
  const address = useAddress();
  const toast = useToast();
  const chainId = useChainId();

  const { refetch } = useMyRegistries();

  const onConfirm = async ({
    claims,
    ...registry
  }: CreateUpdateRegistryFormValues) => {
    if (!address) {
      toast({
        title: "Error",
        description: "You must be connected to create a registry",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const supabase = await getClient();

    if (!supabase) {
      return;
    }

    const admin_id = registry.admin_id || address;
    const chain_id = registry.chain_id || chainId;

    const { error, data } = await supabase
      .from("registries")
      .upsert([{ ...registry, admin_id, chain_id }])
      .select();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const insertedRegistry = data[0];

    if (!insertedRegistry) {
      toast({
        title: "Error",
        description: "Something went wrong with inserting a registry",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Registry created",
      status: "success",
    });

    const claimInserts: ClaimInsert[] = claims.map(({ hypercert_id }) => ({
      registry_id: insertedRegistry.id,
      hypercert_id,
      chain_id: chainId,
      admin_id: address,
    }));

    const { error: insertClaimsError } = await supabase
      .from("claims")
      .insert(claimInserts)
      .select();

    if (insertClaimsError) {
      toast({
        title: "Error",
        description: insertClaimsError.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    await refetch();
    modalProps.onClose();
  };

  return (
    <GenericModal title="Create registry" {...modalProps}>
      <CreateOrUpdateRegistryForm
        initialValues={initialValues}
        onSubmitted={onConfirm}
      />
    </GenericModal>
  );
};
