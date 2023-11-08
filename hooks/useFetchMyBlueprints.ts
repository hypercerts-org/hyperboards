import { useAddress } from "@/hooks/useAddress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@chakra-ui/react";

export const useFetchMyBlueprints = () => {
  const address = useAddress();
  const toast = useToast();

  return useQuery(["myBlueprints", address], async () => {
    if (!address) {
      toast({
        title: "No address found",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    return supabase
      .from("blueprints")
      .select("*, registries ( * )")
      .eq("minter_address", address);
  });
};
