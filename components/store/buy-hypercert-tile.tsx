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
import { Offer } from "@/hooks/store";
import { parseInt } from "lodash";
import { useBuyFraction } from "@/hooks/useBuyFraction";

export const BuyHypercertTile = ({
  metaData,
  offer,
}: {
  metaData: HypercertMetadata;
  offer?: Offer;
}) => {
  const toast = useToast();
  const buyFraction = useBuyFraction();

  const handleWrite = async () => {
    try {
      if (!offer) {
        throw new Error("Cannot buy without offer");
      }
      await buyFraction({
        offerId: offer.id,
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
    parseInt(offer?.minUnitsPerTrade || "0", 10),
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
              min={parseInt(offer.minUnitsPerTrade, 10)}
              max={parseInt(offer.fractionID.units, 10)}
              value={sliderValue}
              aria-label="buy fractions slider"
              onChange={(v) => setSliderValue(v)}
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
