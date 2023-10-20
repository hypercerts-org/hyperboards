import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";

export const useDeleteClaim = () => {
  const getClient = useGetAuthenticatedClient();
  return useMutation(async (claimId: string) => {
    const client = await getClient();

    return client?.from("claims").delete().eq("id", claimId);
  });
};
