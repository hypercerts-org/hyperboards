import { useRouter } from "next/router";
import { useFetchHypercertById } from "@/hooks/useFetchHypercertById";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Center,
  Divider as ChakraDivider,
  DividerProps,
  Flex,
  HStack,
  Image,
  Spinner,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { useFetchDefaultSponsorMetadataByAddress } from "@/hooks/useFetchDefaultSponsorMetadataByAddress";
import { formatAddress, formatWorkTimeframe } from "@/utils/formatting";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { PropsWithChildren, useRef } from "react";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { useFetchCollectionsForHypercert } from "@/hooks/useFetchCollectionsForHypercert";
import { CollectionTag } from "@/components/collection-tag";
import { MarketplaceStats } from "@/components/marketplace/marketplace-stats";
import _, { uniqBy } from "lodash";
import { BuyHypercertButton } from "@/components/marketplace/buy-hypercert-button";
import { useAddress } from "@/hooks/useAddress";
import { ListForSaleButton } from "@/components/marketplace/list-for-sale-button";
import Link from "next/link";
import { ProfileInfo } from "@/components/profile-info";
import { OwnershipStats } from "@/components/marketplace/ownership-stats";
import { ChainBadge } from "@/components/chain-badge";

export const Index = () => {
  const { query } = useRouter();
  const { hypercertId } = query;

  const address = useAddress();

  const { data: hypercert, isLoading } = useFetchHypercertById(
    hypercertId as string,
  );
  const { data: fractionsData } = useFetchHypercertFractionsByHypercertId(
    hypercertId as string,
  );
  const { data: collectionsData } = useFetchCollectionsForHypercert(
    hypercertId as string,
  );

  const { data: displayData } = useFetchDefaultSponsorMetadataByAddress(
    hypercert?.creator_address,
  );

  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const listForSaleButtonRef = useRef<HTMLButtonElement>(null);

  const clickViewListings = () => {
    buyButtonRef.current?.click();
  };

  const clickListForSale = () => {
    listForSaleButtonRef.current?.click();
  };

  const ownedByConnectedUser = !!fractionsData?.some(
    (fraction) => fraction.creator_address === address,
  );
  const createdByCurrentUser = hypercert?.creator_address === address;

  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (!hypercert?.metadata) {
    return (
      <Center>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Hypercert not found</AlertTitle>
          <AlertDescription>
            The hypercert with id {hypercertId} does not exist.
          </AlertDescription>
        </Alert>
      </Center>
    );
  }

  const uniqueCollections = _.uniqBy(collectionsData, "id");

  return (
    <Flex width={"100%"} paddingX={5}>
      <Flex width={"100%"} border={"1px solid black"} borderTop={"none"}>
        <VStack
          width={"100%"}
          divider={<Divider />}
          spacing={0}
          borderRight={"1px solid black"}
          alignItems={"flex-start"}
          minW={0}
        >
          <Flex width={"100%"} px={10} pt={7} pb={15} flexDirection={"column"}>
            <Flex
              justifyContent={"space-between"}
              width={"100%"}
              alignItems={"center"}
              mb={6}
            >
              <Link href={"/hypercerts"}>
                <Flex alignItems={"center"}>
                  <Image
                    alt="Return to marketplace"
                    mr={6}
                    src="/icons/arrow_left.svg"
                  />
                  <Text>Back to marketplace</Text>
                </Flex>
              </Link>
              <Image alt="Share hypercert" src="/icons/share.svg" />
            </Flex>
            <Flex>
              <Text
                fontSize={"4xl"}
                lineHeight={"2.25rem"}
                textStyle={"secondary"}
              >
                {hypercert?.metadata?.name}
              </Text>
              <ChainBadge ml={2} hypercertId={hypercertId as string} />
            </Flex>
          </Flex>
          <HStack divider={<Divider orientation="vertical" />} width={"100%"}>
            <VStack
              width={"100%"}
              alignItems={"flex-start"}
              justifyContent={"center"}
              py={5}
              pl={5}
            >
              <Text textStyle={"secondary"} fontSize={"sm"}>
                Creator
              </Text>
              <Text>
                {displayData?.data?.companyName ||
                  formatAddress(hypercert?.creator_address)}
                {createdByCurrentUser && (
                  <Text as={"span"} ml={1}>
                    (you)
                  </Text>
                )}
              </Text>
            </VStack>
            <VStack
              width={"100%"}
              alignItems={"flex-start"}
              justifyContent={"center"}
              py={5}
              pl={5}
            >
              <Text textStyle={"secondary"} fontSize={"sm"}>
                Collection
              </Text>
              {uniqueCollections?.length ? (
                <HStack flexWrap={"wrap"}>
                  {uniqueCollections.map((collection) => (
                    <CollectionTag
                      key={collection.id}
                      name={collection.name}
                      count={
                        (collection.claims[0] as unknown as { count: number })
                          .count
                      }
                    />
                  ))}
                </HStack>
              ) : (
                <Text>No collections</Text>
              )}
            </VStack>
          </HStack>
          <Flex px={4} py={5} alignItems={"center"}>
            <Text as="span" textStyle={"secondary"} fontSize={"sm"}>
              Work timeframe:
            </Text>
            <Text as="span" fontSize={"16px"}>
              {formatWorkTimeframe([
                hypercert?.metadata?.work_timeframe_from,
                hypercert?.metadata?.work_timeframe_to,
              ])}
            </Text>
          </Flex>
          <VStack px={4} py={5} alignItems={"flex-start"}>
            <Text as="span" textStyle={"secondary"} fontSize={"sm"}>
              Work scope:
            </Text>
            <HStack flexWrap={"wrap"}>
              {hypercert?.metadata?.work_scope?.map((x) => (
                <Tag key={x} size={"lg"}>
                  <Text fontWeight={400}>{x}</Text>
                </Tag>
              ))}
            </HStack>
          </VStack>

          <AccordionLine
            title="description"
            previewLine={hypercert?.metadata.description}
          >
            {hypercert?.metadata.description}
          </AccordionLine>
          <AccordionLine
            title="contributors"
            count={hypercert?.metadata?.contributors?.length || 0}
          >
            {hypercert?.metadata?.hypercert?.contributors?.join(", ")}
          </AccordionLine>
          <AccordionLine
            title="owners"
            count={uniqBy(fractionsData || [], (x) => x.owner_address).length}
          >
            <HStack flexWrap={"wrap"}>
              {uniqBy(fractionsData || [], (x) => x.owner_address).map((x) => (
                <ProfileInfo key={x.owner_address} address={x.owner_address} />
              ))}
            </HStack>
          </AccordionLine>
        </VStack>
        <Flex maxW={"440px"} minW={"440px"}>
          <VStack width={"100%"} spacing={0}>
            <Center backgroundColor={"black"} width={"100%"} py={10}>
              <Image
                alt={"Hypercert detail image"}
                src={hypercert?.metadata?.image}
              />
            </Center>
            <Box width={"100%"} backgroundColor={"black"} height={"100%"}>
              {ownedByConnectedUser && (
                <VStack
                  backgroundColor={"white"}
                  borderRadius={"12px"}
                  width={"100%"}
                  px={5}
                  py={6}
                  spacing={4}
                  borderBottom={"1px solid black"}
                >
                  <OwnershipStats hypercertId={hypercertId as string} />
                  <HStack width={"100%"}>
                    <ListForSaleButton
                      width={"100%"}
                      hypercertId={hypercertId as string}
                      onClickViewListings={clickViewListings}
                      ref={listForSaleButtonRef}
                    />
                    <Button
                      variant="blackAndWhiteOutline"
                      width={"100%"}
                      backgroundColor={"background"}
                    >
                      Transfer
                    </Button>
                  </HStack>
                </VStack>
              )}
              <VStack
                backgroundColor={"white"}
                borderRadius={"12px"}
                width={"100%"}
                px={5}
                py={6}
                spacing={4}
              >
                <MarketplaceStats hypercertId={hypercertId as string} />
                <HStack width={"100%"}>
                  <BuyHypercertButton
                    ref={buyButtonRef}
                    width={"100%"}
                    hypercertId={hypercertId as string}
                    onClickListForSale={clickListForSale}
                  />
                  <Button
                    variant="blackAndWhiteOutline"
                    width={"100%"}
                    isDisabled
                    backgroundColor={"background"}
                  >
                    Make offer
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

const AccordionLine = ({
  title,
  count,
  previewLine,
  children,
}: PropsWithChildren<{
  title: string;
  count?: number;
  previewLine?: string;
}>) => {
  return (
    <Accordion width={"100%"} allowToggle borderBottomColor={"transparent"}>
      <AccordionItem width={"100%"}>
        {({ isExpanded }) => (
          <>
            <AccordionButton width={"100%"} display={"flex"}>
              <Flex width={"100%"} alignItems={"center"}>
                <Text
                  textStyle={"secondary"}
                  fontSize={"sm"}
                  as="span"
                  textAlign="left"
                  mr={4}
                >
                  {title}
                </Text>
                {count !== undefined && <Badge>{count}</Badge>}
                {!isExpanded && previewLine !== undefined && (
                  <Flex minW={0}>
                    <Text
                      overflow={"hidden"}
                      fontSize={"sm"}
                      as={"span"}
                      isTruncated
                    >
                      {previewLine}
                    </Text>
                  </Flex>
                )}

                <Box ml={"auto"}>
                  {isExpanded ? (
                    <BiChevronUp ml={"auto"} fontSize="18px" />
                  ) : (
                    <BiChevronDown ml={"auto"} fontSize="18px" />
                  )}
                </Box>
              </Flex>
            </AccordionButton>
            <AccordionPanel pb={4}>{children}</AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

const Divider = ({ ...props }: DividerProps) => (
  <ChakraDivider {...props} borderColor={"black"} />
);

export default Index;
