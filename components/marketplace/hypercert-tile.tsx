import { useHover } from "@uidotdev/usehooks";
import { Box, Flex, Image } from "@chakra-ui/react";
import { useFetchHypercertById } from "@/hooks/useFetchHypercertById";
import { MarketplaceStats } from "@/components/marketplace/marketplace-stats";
import { ChainBadge } from "@/components/chain-badge";

export const HypercertTile = ({ hypercertId }: { hypercertId: string }) => {
  const [ref, isHovered] = useHover();
  const { data: hypercert } = useFetchHypercertById(hypercertId);

  return (
    <Flex
      ref={ref}
      maxWidth={"335px"}
      flexDir={"column"}
      outline={isHovered ? "1px solid black" : "none"}
      cursor={"pointer"}
      position={"relative"}
    >
      <Image
        alt="Detail image for hypercert"
        src={hypercert?.metadata?.image}
        width={"100%"}
        height={"100%"}
        objectFit={"cover"}
        backgroundColor={isHovered ? "black" : undefined}
      />
      <Box backgroundColor={isHovered ? "white" : "none"} py={5} px={3}>
        <MarketplaceStats hypercertId={hypercertId} />
      </Box>
      <ChainBadge
        hypercertId={hypercertId}
        position={"absolute"}
        right={2}
        top={2}
      />
    </Flex>
  );
};
