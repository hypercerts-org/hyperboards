import { GridItem, SimpleGrid } from "@chakra-ui/react";
import { BuyHypercertTile } from "@/components/store/buy-hypercert-tile";
import { useStoreHypercerts } from "@/hooks/store";

export const Store = () => {
  const { data } = useStoreHypercerts();

  const hypercerts = data || [];

  return (
    <SimpleGrid columns={3} spacing={10}>
      {hypercerts.map((x) => (
        <GridItem key={x.claim!.id}>
          <BuyHypercertTile
            metaData={x.metadata}
            offer={x.offer}
            offerFromContract={x.offerFromContract}
          />
        </GridItem>
      ))}
    </SimpleGrid>
  );
};
