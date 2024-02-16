import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "@tanstack/react-query";

export const useDeleteBlueprint = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["deleteBlueprint"],
    mutationFn: async (blueprintId: number) => {
      const client = await getClient();

      if (!client) {
        throw new Error("Not logged in");
      }

      return client?.from("blueprints").delete().eq("id", blueprintId);
    },
  });
};
