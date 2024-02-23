import { FractionSponsorMetadataInsert } from "@/types/database-entities";
import { useGetAuthenticatedClient } from "@/hooks/useGetAuthenticatedClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";

type Values = {
  hypercertId: string;
  fractionId: string;
  chainId: number;
  values: Record<string, string>;
}[];

export const useCreateOrUpdateFractionSpecificMetadata = (strategy: string) => {
  const getClient = useGetAuthenticatedClient();
  const toast = useToast();

  return useMutation({
    mutationKey: ["fraction-specific-metadata", "create-or-update"],
    mutationFn: async ({ values }: { values: Values }) => {
      const insertValues = await applyStrategy(strategy, values);

      if (!insertValues) {
        throw new Error("No insert values");
      }

      const client = await getClient();

      if (!client) {
        throw new Error("No client");
      }

      return client.from("fraction_sponsor_metadata").upsert(insertValues);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Fraction specific metadata updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

async function applyGithubStrategy(
  values: Values,
): Promise<FractionSponsorMetadataInsert[]> {
  return Promise.resolve(
    values.map(({ values, fractionId, hypercertId, chainId }) => {
      const githubUsername = values.githubUsername;
      const image = `https://github.com/${githubUsername}.png`;
      return {
        hypercert_id: hypercertId,
        fraction_id: fractionId,
        chain_id: chainId,
        type: "person",
        image,
        companyName: githubUsername,
        firstName: githubUsername,
        lastName: githubUsername,
        value: githubUsername,
        strategy: "github",
      };
    }),
  );
}

const applyStrategy = async (
  strategy: string,
  values: Values,
): Promise<FractionSponsorMetadataInsert[]> => {
  switch (strategy) {
    case "github":
      return applyGithubStrategy(values);
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
};
