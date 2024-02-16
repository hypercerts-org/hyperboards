import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "@tanstack/react-query";

export const useDeleteRegistry = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["deleteRegistry"],
    mutationFn: async (registryId: string) => {
      const client = await getClient();

      return client?.from("registries").delete().eq("id", registryId);
    },
  });
};
