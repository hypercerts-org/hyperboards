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
import { PropsWithChildren } from "react";
import { useFetchHypercertFractionsByHypercertId } from "@/hooks/useFetchHypercertFractionsByHypercertId";
import { useFetchCollectionsForHypercert } from "@/hooks/useFetchCollectionsForHypercert";

export const Index = () => {
  const { query } = useRouter();

  const { hypercertId } = query;

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
    hypercert?.owner,
  );

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

  const unitsForSale = 10;
  const unitsListed = 100;
  const pricePerUnit = 0.25;

  return (
    <Flex width={"100%"} paddingX={5}>
      <Flex
        width={"100%"}
        border={"1px solid black"}
        borderTop={"none"}
        height={"100%"}
      >
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
              mb={10}
            >
              <Flex alignItems={"center"}>
                <Image
                  alt="Return to marketplace"
                  mr={6}
                  src="/icons/arrow_left.svg"
                />
                <Text>Back to marketplace</Text>
              </Flex>
              <Image alt="Share hypercert" src="/icons/share.svg" />
            </Flex>
            <Text fontSize={"4xl"} textStyle={"secondary"}>
              {hypercert?.metadata?.name}
            </Text>
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
                  formatAddress(hypercert?.owner)}
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
              <Text>
                {collectionsData?.length
                  ? collectionsData.map((x) => (
                      <Tag key={x.id} size={"lg"}>
                        {x.name}{" "}
                        <Text opacity={0.5} ml={8} as={"span"}>
                          {(x.claims[0] as unknown as { count: number }).count}
                        </Text>
                      </Tag>
                    ))
                  : "No collections"}
              </Text>
            </VStack>
          </HStack>
          <Flex px={4} py={5} alignItems={"center"}>
            <Text as="span" textStyle={"secondary"} fontSize={"sm"}>
              Work timeframe:
            </Text>
            <Text as="span" fontSize={"16px"}>
              {formatWorkTimeframe(
                hypercert?.metadata?.hypercert?.work_timeframe?.value,
              )}
            </Text>
          </Flex>
          <VStack px={4} py={5} alignItems={"flex-start"}>
            <Text as="span" textStyle={"secondary"} fontSize={"sm"}>
              Work scope:
            </Text>
            <HStack>
              {hypercert?.metadata?.hypercert?.work_scope?.value?.map((x) => (
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
            count={
              hypercert?.metadata?.hypercert?.contributors?.value?.length || 0
            }
          >
            {hypercert?.metadata?.hypercert?.contributors?.value?.join(", ")}
          </AccordionLine>
          <AccordionLine title="owners" count={fractionsData?.length}>
            {fractionsData?.map((x) => x.owner).join(",")}
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
              <VStack
                backgroundColor={"white"}
                borderRadius={"12px"}
                width={"100%"}
                height={"100%"}
                px={5}
                py={6}
                spacing={8}
              >
                <Flex justifyContent={"space-between"} width={"100%"}>
                  <SellStat
                    amount={unitsForSale}
                    unit="units"
                    subText={`${unitsListed} listed`}
                  />
                  <SellStat amount={pricePerUnit} unit="ETH" subText="unit" />
                </Flex>
                <HStack width={"100%"}>
                  <Button variant={"blackAndWhite"} width={"100%"}>
                    Buy
                  </Button>
                  <Button
                    variant="blackAndWhiteOutline"
                    width={"100%"}
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

const SellStat = ({
  amount,
  subText,
  unit,
}: {
  amount: number;
  unit: string;
  subText: string;
}) => {
  return (
    <Flex alignItems={"flex-end"}>
      <Text fontSize={"lg"} lineHeight={"1.7rem"}>
        {amount}
      </Text>
      <Text fontSize={"sm"}>&nbsp;{unit}</Text>
      <Text fontSize={"sm"} opacity={0.4}>
        &nbsp;/&nbsp;
      </Text>
      <Text fontSize={"sm"} opacity={0.4}>
        {subText}
      </Text>
    </Flex>
  );
};

const Divider = ({ ...props }: DividerProps) => (
  <ChakraDivider {...props} borderColor={"black"} />
);

export default Index;
