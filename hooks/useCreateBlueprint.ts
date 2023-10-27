import { useAddress } from "@/hooks/useAddress";
import { useMutation } from "wagmi";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useToast } from "@chakra-ui/react";
import { MintingFormValues } from "@/components/minting/minting-form";

export const useCreateBlueprint = () => {
  const admin_id = useAddress();
  const getClient = useGetAuthenticatedClient();
  const toast = useToast();

  return useMutation(
    async ({
      address,
      registryId,
      ...values
    }: { address: string; registryId: string } & MintingFormValues) => {
      if (!admin_id) {
        toast({
          title: "No address",
          description: "Please connect your wallet",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const client = await getClient();
      if (!client) {
        toast({
          title: "Not logged in",
          description: "Please connect your wallet",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const { data, error } = await client
        .from("blueprints")
        .insert([
          {
            admin_id,
            registry_id: registryId,
            minter_address: address,
            form_values: JSON.parse(JSON.stringify(values)),
          },
        ])
        .select();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      return data;
    },
  );
};
