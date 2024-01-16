import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";

export const useRemoveRegistryFromHyperboard = () => {
  const getClient = useGetAuthenticatedClient();
  return useMutation(
    async ({
      hyperboardId,
      registryId,
    }: {
      hyperboardId: string;
      registryId: string;
    }) => {
      const client = await getClient();

      return client
        ?.from("hyperboard_registries")
        .delete()
        .eq("hyperboard_id", hyperboardId)
        .eq("registry_id", registryId);
    },
  );
};
