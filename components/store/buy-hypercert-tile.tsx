import {
  Button,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";

import IHypercertTrader from "../../abi/IHypercertTrader.json";

export const BuyHypercertTile = ({ claimId }: { claimId: string }) => {
  const { address } = useAccount();
  const { write } = useContractWrite({
    address: "0x689587461AA3103D3D7975c5e4B352Ab711C14C2",
    abi: IHypercertTrader,
    functionName: "buyUnits",
    args: [address!, 0, 1, "0x0000000000000000000000000000000000000000", 1],
    value: 1n,
  });

  const handleWrite = () => {
    write();
  };
  const [sliderValue, setSliderValue] = useState(10);
  return (
    <Flex flexDirection={"column"}>
      {claimId}
      <Slider
        value={sliderValue}
        aria-label="slider-ex-1"
        onChange={(v) => setSliderValue(v)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>{" "}
      <Button onClick={handleWrite}>BUY</Button>
    </Flex>
  );
};
