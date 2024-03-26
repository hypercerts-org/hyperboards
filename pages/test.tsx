import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "@/components/providers";

const TestPage = () => {
  const client = useHypercertClient();
  const address = "0x1c9f765c579f94f6502acd9fc356171d85a1f8d0";

  useQuery({
    queryKey: ["all-claims-for-address", address],
    queryFn: async () => {
      if (!client) {
        return null;
      }

      if (!address) {
        return null;
      }
      const result = await client.indexer.claimsByOwner(address, {
        chainId: 11155111,
        orderDirections: "desc",
        first: 100,
        skip: 0,
      });
      console.log("result", result);
      return result;
    },
    enabled: !!client && !!address,
  });
  return <div>Test Page</div>;
};

export default TestPage;
