import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { HypercertMetadata } from "@hypercerts-org/sdk";
import { Offer, OfferFromContract } from "@/hooks/store";
import { useBuyFraction } from "@/hooks/useBuyFraction";
import { formatEther } from "viem";

export const BuyHypercertTile = ({
  metaData,
  offer,
  offerFromContract,
  totalUnits,
}: {
  metaData: HypercertMetadata;
  offer?: Offer;
  offerFromContract?: OfferFromContract;
  totalUnits: number;
}) => {
  const toast = useToast();
  const buyFraction = useBuyFraction();

  const handleWrite = async () => {
    try {
      if (!offer || !offerFromContract) {
        throw new Error("Cannot buy without offer");
      }
      console.log(offer);
      await buyFraction({
        offerId: offer.id,
        offer: offerFromContract,
        numberOfUnitsToBuy: sliderValue,
      });

      toast({
        description: "Transaction pending",
        status: "info",
      });
    } catch (error: any) {
      toast({
        description: error.message || "Something went wrong",
        status: "error",
      });
    }
  };
  const [sliderValue, setSliderValue] = useState(
    offerFromContract?.minUnitsPerTrade || 0n,
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const percentageAvailable =
    (Number(offerFromContract?.unitsAvailable.toString()) / totalUnits) * 100;

  const totalPrice = offerFromContract
    ? formatEther(
        sliderValue * offerFromContract?.acceptedTokens[0].minimumAmountPerUnit,
      )
    : "unknown";

  if (!offer || !offerFromContract) {
    return (
      <Flex flexDirection={"column"}>
        <Image src={metaData?.image} alt={"Hypercert display image"} />
        <Text>{metaData.name}</Text>
        <div>Offer unknown</div>
      </Flex>
    );
  }

  const minValue = Number(offer.minUnitsPerTrade.toString());
  const maxValue = Number(offerFromContract.unitsAvailable.toString());

  const currentPercentageValue =
    (Number(sliderValue.toString()) / totalUnits) * 100;

  return (
    <VStack alignItems={"flex-start"} flexDirection={"column"} width={"100%"}>
      <Image
        src={metaData?.image}
        alt={"Hypercert display image"}
        minWidth={"100%"}
        height={"auto"}
        mb={4}
      />
      <Heading fontFamily={"Switzer"} size={"md"}>
        {metaData.name}
      </Heading>
      <InputGroup size="sm">
        <Input
          min={0}
          max={percentageAvailable}
          value={currentPercentageValue}
          type={"number"}
          placeholder={`${percentageAvailable}% available`}
          readOnly
        />
        <InputRightAddon>%</InputRightAddon>
      </InputGroup>
      <Box minHeight={"30px"} width={"100%"}>
        <Slider
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          min={minValue}
          max={maxValue}
          value={Number(sliderValue.toString())}
          aria-label="buy fractions slider"
          onChange={(v) => {
            setSliderValue(BigInt(v));
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg="teal.500"
            color="white"
            placement="top"
            isOpen={showTooltip}
            label={`${currentPercentageValue.toFixed(
              2,
            )}% (${sliderValue} units)`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
      </Box>
      <Text>Price: {totalPrice} ETH</Text>
      <Button onClick={handleWrite} width={"100%"}>
        BUY
      </Button>
    </VStack>
  );
};
