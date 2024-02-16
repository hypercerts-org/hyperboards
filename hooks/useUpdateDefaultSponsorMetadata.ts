import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "@tanstack/react-query";
import { DefaultSponsorMetadataInsert } from "@/types/database-entities";

export const useUpdateDefaultSponsorMetadata = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["updateDefaultSponsorMetadata"],
    mutationFn: async ({ data }: { data: DefaultSponsorMetadataInsert }) => {
      const client = await getClient();

      if (!client) {
        throw new Error("Not logged in");
      }

      return client
        .from("default_sponsor_metadata")
        .update(data)
        .eq("address", data.address)
        .throwOnError();
    },
  });
};
