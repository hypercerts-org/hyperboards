import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { DefaultSponsorMetadataInsert } from "@/types/database-entities";
import { useMutation } from "@tanstack/react-query";

export const useCreateDefaultSponsorMetadata = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation({
    mutationKey: ["createDefaultSponsorMetadata"],
    mutationFn: async ({ data }: { data: DefaultSponsorMetadataInsert }) => {
      const client = await getClient();

      if (!client) {
        throw new Error("Not logged in");
      }

      return client
        .from("default_sponsor_metadata")
        .insert([data])
        .throwOnError();
    },
  });
};
