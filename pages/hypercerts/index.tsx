import { useFetchAllCollections } from "@/hooks/useFetchAllCollections";
import {
  Badge,
  Center,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { CollectionTag } from "@/components/collection-tag";
import { useState } from "react";
import _ from "lodash";
import { HypercertTile } from "@/components/marketplace/hypercert-tile";
import Link from "next/link";

export const Index = () => {
  const { data, isLoading } = useFetchAllCollections();
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!data?.data) {
    return "Nothing found";
  }

  const totalCount = _.sumBy(
    data.data,
    (collection) => collection.claims.length,
  );
  const displayedCollections =
    selectedCollections.length === 0
      ? data.data
      : data.data.filter((collection) =>
          selectedCollections.includes(collection.id),
        );

  const displayedHypercerts = _.uniq(
    displayedCollections
      .map((collection) => collection.claims.map((claim) => claim.hypercert_id))
      .flat(),
  );

  return (
    <>
      <Flex mt={10} mb={10}>
        <Text
          textStyle={"secondary"}
          fontSize={["42px", "50px", "88px"]}
          lineHeight={"88px"}
        >
          Hypercerts
        </Text>
        <Badge height={"fit-content"} ml={4} size={"lg"}>
          {totalCount}
        </Badge>
      </Flex>
      <Flex
        flexWrap={"wrap"}
        maxWidth={"800px"}
        justifyContent={"center"}
        mb={"60px"}
      >
        <CollectionTag
          name="All"
          count={totalCount}
          isSelected={selectedCollections.length === 0}
          onClick={() => setSelectedCollections([])}
        />
        {data.data.map((collection) => (
          <CollectionTag
            key={collection.id}
            name={collection.name}
            count={collection.claims.length}
            isSelected={selectedCollections.includes(collection.id)}
            onClick={() => {
              setSelectedCollections((currentValue) => {
                if (currentValue.includes(collection.id)) {
                  return currentValue.filter((id) => id !== collection.id);
                } else {
                  return [...currentValue, collection.id];
                }
              });
            }}
          />
        ))}
      </Flex>
      <SimpleGrid columns={[1, 2, 4]} spacing={5} mb={10}>
        {displayedHypercerts.map((hypercertId) => (
          <Link key={hypercertId} href={`/hypercerts/${hypercertId}`}>
            <HypercertTile hypercertId={hypercertId} />
          </Link>
        ))}
      </SimpleGrid>
    </>
  );
};

export default Index;
