import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";

export const useDeleteRegistry = () => {
  const getClient = useGetAuthenticatedClient();
  return useMutation(async (registryId: string) => {
    const client = await getClient();

    return client?.from("registries").delete().eq("id", registryId);
  });
};
