import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useStoreHypercerts } from "@/hooks/store";
import { BuyHypercertTile } from "@/components/store/buy-hypercert-tile";
import { GridItem, SimpleGrid } from "@chakra-ui/react";

const StorePage = () => {
  const { data } = useStoreHypercerts();

  const hypercerts = data || [];
  return (
    <div>
      <ConnectButton />
      <SimpleGrid columns={3} spacing={10}>
        {hypercerts.map((x) => (
          <GridItem key={x.claim!.id}>
            <BuyHypercertTile claimId={x.claim!.id} />
          </GridItem>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default StorePage;
