import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";
import { useToast } from "@chakra-ui/react";
import { DefaultSponsorMetadataInsert } from "@/types/database-entities";

export const useCreateDefaultSponsorMetadata = () => {
  const getClient = useGetAuthenticatedClient();
  const toast = useToast();

  return useMutation(
    async ({ data }: { data: DefaultSponsorMetadataInsert }) => {
      const client = await getClient();

      if (!client) {
        toast({
          title: "Error",
          description:
            "You must be logged in to create default sponsor metadata",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return null;
      }

      return client.from("sponsor_metadata").insert([data]);
    },
  );
};
