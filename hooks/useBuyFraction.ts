import { useAccount, useContractWrite } from "wagmi";
import IHypercertTrader from "@/abi/IHypercertTrader.json";
import { parseInt } from "lodash";
import { useToast } from "@chakra-ui/react";

export const useBuyFraction = () => {
  const { address } = useAccount();
  const toast = useToast();
  const { writeAsync } = useContractWrite({
    address: "0x689587461AA3103D3D7975c5e4B352Ab711C14C2",
    abi: IHypercertTrader,
    functionName: "buyUnits",
    onSettled: () => {
      toast({
        description: "Successfully bought fraction",
        status: "success",
      });
    },
  });

  return ({
    offerId,
    numberOfUnitsToBuy,
    paymentToken = "0x0000000000000000000000000000000000000000",
  }: {
    offerId: string;
    numberOfUnitsToBuy: number;
    paymentToken?: string;
  }) => {
    if (!address) {
      throw new Error("User not connected");
    }

    const orderId = parseInt(offerId.split("-")[1], 10);

    if (orderId === undefined || isNaN(orderId)) {
      throw new Error("Cannot get order id");
    }

    return writeAsync({
      args: [address, orderId, numberOfUnitsToBuy, paymentToken, 1],
      value: BigInt(numberOfUnitsToBuy),
    });
  };
};
