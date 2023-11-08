import { ModalProps } from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/react";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useAddress } from "@/hooks/useAddress";
import {
  CreateOrUpdateHyperboardForm,
  CreateOrUpdateHyperboardFormValues,
} from "@/components/forms/create-or-update-hyperboard-form";
import { GenericModal } from "@/components/GenericModal";
import { useFetchMyHyperboards } from "@/hooks/useFetchMyHyperboards";
import { useAddRegistriesToHyperboard } from "@/hooks/useAddRegistriesToHyperboard";
import { useChainId } from "wagmi";

export const CreateHyperboardModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  const getClient = useGetAuthenticatedClient();
  const address = useAddress();
  const toast = useToast();
  const chainId = useChainId();

  const { refetch } = useFetchMyHyperboards();
  const { mutateAsync: addRegistriesToHyperboard } =
    useAddRegistriesToHyperboard();

  const onConfirm = async (values: CreateOrUpdateHyperboardFormValues) => {
    if (!address) {
      toast({
        title: "Error",
        description: "You must be connected to create a hyperboard",
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

    if (!chainId) {
      return;
    }

    const { data: insertedHyperboard, error } = await supabase
      .from("hyperboards")
      .insert({
        name: values.name,
        chain_id: chainId,
        admin_id: address,
      })
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

    const insertedHyperboardId = insertedHyperboard?.[0]?.id;
    if (!insertedHyperboardId) {
      toast({
        title: "Error",
        description: "Could not create hyperboard",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (values.registries?.length) {
      try {
        await addRegistriesToHyperboard({
          hyperboardId: insertedHyperboardId,
          registryIds: values.registries.map(({ id }) => id),
        });
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: "Could not add registries to hyperboard",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Hyperboard created",
      status: "success",
    });

    await refetch();
    modalProps.onClose();
  };

  return (
    <GenericModal title="Create Hyperboard" {...modalProps}>
      <CreateOrUpdateHyperboardForm onSubmitted={onConfirm} />
    </GenericModal>
  );
};
