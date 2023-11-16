import { useMutation } from "wagmi";
import { ClaimInsert } from "@/types/database-entities";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useToast } from "@chakra-ui/react";

export const useCreateClaims = () => {
  const getClient = useGetAuthenticatedClient();
  const toast = useToast();
  return useMutation(async ({ claims }: { claims: ClaimInsert[] }) => {
    const supabase = await getClient();
    if (!supabase) {
      toast({
        title: "No client found",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    return supabase.from("claims").upsert(claims).select();
  });
};
