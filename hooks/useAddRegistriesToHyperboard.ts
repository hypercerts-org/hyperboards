import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "wagmi";
import { HyperboardRegistryInsert } from "@/types/database-entities";
import { uniq } from "lodash";

export const useAddRegistriesToHyperboard = () => {
  const getClient = useGetAuthenticatedClient();

  return useMutation(
    async ({
      hyperboardId,
      registryIds,
    }: {
      hyperboardId: string;
      registryIds: string[];
    }) => {
      const client = await getClient();

      if (!client) {
        return;
      }

      const inserts: HyperboardRegistryInsert[] = uniq(registryIds).map(
        (registryId) => ({
          hyperboard_id: hyperboardId,
          registry_id: registryId,
        }),
      );

      return client.from("hyperboard_registries").insert(inserts).select("*");
    },
  );
};
