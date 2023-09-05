import { useAccount, useContractWrite } from "wagmi";
import IHypercertTrader from "@/abi/IHypercertTrader.json";

export const useBuyFraction = () => {
  const pricePerUnit = 1;
  const { address } = useAccount();
  const { writeAsync } = useContractWrite({
    address: "0x689587461AA3103D3D7975c5e4B352Ab711C14C2",
    abi: IHypercertTrader,
    functionName: "buyUnits",
    args: [address!, 0, 1, "0x0000000000000000000000000000000000000000", 1],
    value: 1n,
  });

  return ({
    orderId,
    numberOfUnitsToBuy,
    paymentToken = "0x0000000000000000000000000000000000000000",
  }: {
    orderId: number;
    numberOfUnitsToBuy: number;
    paymentToken?: string;
  }) => {
    if (!address) {
      throw new Error("User not connected");
    }
    return writeAsync({
      args: [
        address,
        orderId,
        numberOfUnitsToBuy,
        paymentToken,
        pricePerUnit * numberOfUnitsToBuy,
      ],
    });
  };
};
