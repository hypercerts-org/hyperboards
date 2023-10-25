import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";

export const useDeleteBlueprint = () => {
  const getClient = useGetAuthenticatedClient();
  return useMutation(async (blueprintId: number) => {
    const client = await getClient();

    return client?.from("blueprints").delete().eq("id", blueprintId);
  });
};
