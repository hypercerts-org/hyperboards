import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";
import { DefaultSponsorMetadataInsert } from "@/types/database-entities";

export const useCreateDefaultSponsorMetadata = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation(
    async ({ data }: { data: DefaultSponsorMetadataInsert }) => {
      const client = await getClient();

      if (!client) {
        throw new Error("Not logged in");
      }

      return client
        .from("default_sponsor_metadata")
        .insert([data])
        .throwOnError();
    },
  );
};
