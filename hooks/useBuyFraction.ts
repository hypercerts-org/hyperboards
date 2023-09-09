import { useAccount, useContractWrite } from "wagmi";
import IHypercertTrader from "@/abi/IHypercertTrader.json";
import { parseInt } from "lodash";
import { useToast } from "@chakra-ui/react";
import { TRADER_CONTRACT } from "@/config";
import { OfferFromContract } from "@/hooks/store";

export const useBuyFraction = () => {
  const { address } = useAccount();
  const toast = useToast();
  const { writeAsync } = useContractWrite({
    address: TRADER_CONTRACT,
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
    offer,
    numberOfUnitsToBuy,
    paymentToken = "0x0000000000000000000000000000000000000000",
  }: {
    offerId: string;
    offer: OfferFromContract;
    numberOfUnitsToBuy: BigInt;
    paymentToken?: string;
  }) => {
    if (!address) {
      throw new Error("User not connected");
    }

    const orderId = parseInt(offerId.split("-")[1], 10);

    if (orderId === undefined || isNaN(orderId)) {
      throw new Error("Cannot get order id");
    }

    const acceptedToken = offer.acceptedTokens.find(
      (acceptedToken) => acceptedToken.token === paymentToken,
    );

    if (!acceptedToken) {
      throw new Error("invalid payment token specified");
    }

    const totalTransferValue =
      numberOfUnitsToBuy.valueOf() * BigInt(acceptedToken.minimumAmountPerUnit);

    return writeAsync({
      args: [
        address,
        orderId,
        numberOfUnitsToBuy,
        paymentToken,
        acceptedToken.minimumAmountPerUnit,
      ],
      value: totalTransferValue,
    });
  };
};
