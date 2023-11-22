import { ModalProps } from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/react";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useAddress } from "@/hooks/useAddress";
import { GenericModal } from "@/components/GenericModal";
import { useFetchMyRegistries } from "@/hooks/useFetchMyRegistries";
import { ClaimInsert } from "@/types/database-entities";
import {
  CreateOrUpdateRegistryForm,
  CreateUpdateRegistryFormValues,
} from "@/components/forms/create-or-update-registry-form";
import { useChainId } from "wagmi";
import { useCreateClaims } from "@/hooks/useCreateClaims";
import { useHypercertClient } from "@/components/providers";

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
  const client = useHypercertClient();

  const { refetch } = useFetchMyRegistries();
  const { mutateAsync: createClaims } = useCreateClaims();

  const onConfirm = async ({
    claims,
    ...registry
  }: CreateUpdateRegistryFormValues) => {
    if (!client) {
      toast({
        title: "Error",
        description: "Client not initialized",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

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

    try {
      const claimInserts: ClaimInsert[] = await Promise.all(
        claims.map(
          async ({
            hypercert_id,
            claim_id = crypto.randomUUID(),
            display_size,
          }) => {
            const claim = await client.indexer.claimById(hypercert_id);
            if (!claim.claim) {
              throw new Error("Claim not found");
            }
            return {
              id: claim_id,
              registry_id: insertedRegistry.id,
              display_size: Number(display_size.toString()),
              hypercert_id,
              chain_id: chainId,
              admin_id: address,
              owner_id: claim.claim.owner,
            };
          },
        ),
      );
      await createClaims({
        claims: claimInserts,
      });
    } catch (insertClaimsError) {
      console.error(insertClaimsError);
      toast({
        title: "Error",
        description: "Something went wrong with creating claims",
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
