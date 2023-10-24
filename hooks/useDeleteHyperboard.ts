import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";

export const useDeleteHyperboard = () => {
  const getClient = useGetAuthenticatedClient();
  return useMutation(async (hyperboardId: string) => {
    const client = await getClient();

    return client?.from("hyperboards").delete().eq("id", hyperboardId);
  });
};
