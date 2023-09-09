import {
  Box,
  Button,
  Flex,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { HypercertMetadata } from "@hypercerts-org/sdk";
import { Offer, OfferFromContract } from "@/hooks/store";
import { useBuyFraction } from "@/hooks/useBuyFraction";

export const BuyHypercertTile = ({
  metaData,
  offer,
  offerFromContract,
}: {
  metaData: HypercertMetadata;
  offer?: Offer;
  offerFromContract?: OfferFromContract;
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

  return (
    <Flex flexDirection={"column"}>
      <Image src={metaData?.image} alt={"Hypercert display image"} />
      <Text>{metaData.name}</Text>
      {!offer ? (
        <div>Offer unknown</div>
      ) : (
        <>
          <Box minHeight={"30px"}>
            <Slider
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              min={Number(offer.minUnitsPerTrade.toString())}
              max={Number(offer.unitsAvailable.toString())}
              value={Number(sliderValue.toString())}
              aria-label="buy fractions slider"
              onChange={(v) => setSliderValue(BigInt(v))}
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
                label={`${sliderValue} units`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </Box>
          <Button onClick={handleWrite}>BUY</Button>
        </>
      )}
    </Flex>
  );
};
