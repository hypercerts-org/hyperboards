import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "@tanstack/react-query";

export const useDeleteHyperboard = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["deleteHyperboard"],
    mutationFn: async (hyperboardId: string) => {
      const client = await getClient();

      return client?.from("hyperboards").delete().eq("id", hyperboardId);
    },
  });
};
