import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "@tanstack/react-query";

export const useRemoveRegistryFromHyperboard = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["removeRegistryFromHyperboard"],
    mutationFn: async ({
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
  });
};
