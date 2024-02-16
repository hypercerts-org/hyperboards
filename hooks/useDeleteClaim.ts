import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "@tanstack/react-query";

export const useDeleteClaim = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["deleteClaim"],
    mutationFn: async (claimId: string) => {
      const client = await getClient();

      return client?.from("claims").delete().eq("id", claimId);
    },
  });
};
