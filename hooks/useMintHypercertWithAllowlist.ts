import { useMutation } from "wagmi";
import { useToast } from "@chakra-ui/react";
import { useHypercertClient } from "@/components/providers";
import {
  HypercertMetadata,
  AllowlistEntry,
  TransferRestrictions,
} from "@hypercerts-org/sdk";

export const useMintHypercertWithAllowlist = () => {
  const client = useHypercertClient();
  const toast = useToast();
  return useMutation(
    async ({
      metadata,
      allowlist,
      totalUnits,
    }: {
      metadata: HypercertMetadata;
      allowlist: AllowlistEntry[];
      totalUnits: bigint;
    }) => {
      if (!client) {
        toast({
          title: "Not connected to hypercert client",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      const hash = await client.createAllowlist(
        allowlist,
        metadata,
        totalUnits,
        TransferRestrictions.AllowAll,
      );

      const publicClient = client.config.publicClient;
      const receipt = await publicClient?.waitForTransactionReceipt({
        confirmations: 3,
        hash: hash,
      });

      if (!receipt) {
        toast({
          title: "Error minting hypercert",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      return receipt;
    },
  );
};
