import { useAddress } from "@/hooks/useAddress";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { MintingFormValues } from "@/components/minting/minting-form";
import { useMutation } from "@tanstack/react-query";

export const useCreateBlueprint = () => {
  const admin_id = useAddress();
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["createBlueprint"],
    mutationFn: async ({
      address,
      registryId,
      displaySize,
      ...values
    }: {
      address: string;
      registryId: string;
      displaySize: number;
    } & MintingFormValues) => {
      if (!admin_id) {
        throw new Error("No address found");
      }

      const client = await getClient();
      if (!client) {
        throw new Error("Not logged in");
      }

      const { data, error } = await client
        .from("blueprints")
        .insert([
          {
            admin_id,
            registry_id: registryId,
            minter_address: address,
            display_size: displaySize,
            form_values: JSON.parse(JSON.stringify(values)),
          },
        ])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
