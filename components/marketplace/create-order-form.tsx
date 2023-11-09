import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { LooksRare, QuoteType } from "@hypercerts-org/marketplace-sdk";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
  WalletClient,
} from "wagmi";
import { useHypercertClient } from "@/components/providers";
import {
  HttpTransport,
  isAddress,
  parseEther,
  PublicClient,
  zeroAddress,
} from "viem";
import { useCreateOrder } from "@/hooks/marketplace/useCreateOrder";
import { useInteractionModal } from "@/components/interaction-modal";
import {
  FallbackProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import React from "react";
import { Provider } from "ethers";

interface CreateOfferFormValues {
  fractionId: string;
  price: string;
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  //@ts-ignore
  signer.signTypedData = signer._signTypedData;
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  );
}

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  if (!chain) {
    throw new Error("Chain not found");
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new JsonRpcProvider(value?.url, network),
      ),
    );
  return new JsonRpcProvider(transport.url, network);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(
    () => publicClientToProvider(publicClient),
    [publicClient],
  );
}

export interface Order {
  collection: string;
  collectionType: number;
  strategyId: number;
  subsetNonce: number;
  orderNonce: number;
  endTime: number;
  price: bigint;
  itemIds: string[];
  amounts?: number[];
  startTime?: number;
  additionalParams: string;
}

export const CreateOrderForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOfferFormValues>({
    defaultValues: {
      fractionId:
        "0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-11229318108390969294291362045248350978048",
      price: "1",
    },
  });
  const chainId = useChainId();
  const client = useHypercertClient();
  const { data: walletClient } = useWalletClient();
  const { mutateAsync: createOrder } = useCreateOrder();
  const toast = useToast();
  const { address } = useAccount();
  const { onOpen, onClose, setStep } = useInteractionModal();
  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const onSubmit = async (values: CreateOfferFormValues) => {
    if (!client) {
      return;
    }

    if (!chainId) {
      return;
    }

    if (!walletClient) {
      return;
    }

    if (!address) {
      return;
    }

    onOpen([
      {
        title: "Create",
        description: "Creating order in contract",
      },
      {
        title: "Approve transfer manager",
        description: "Approving transfer manager",
      },
      {
        title: "Approve collection",
        description: "Approving collection",
      },
      {
        title: "Sign order",
        description: "Signing order",
      },
      {
        title: "Create order",
        description: "Creating order",
      },
    ]);

    if (!client.config.publicClient) {
      toast({
        title: "Error",
        description: "Public client not initialized",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    // const signer = walletClientToSigner(walletClient);

    if (!provider) {
      toast({
        title: "Error",
        description: "Provider not initialized",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!signer) {
      toast({
        title: "Error",
        description: "Signer not initialized",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    console.log(chainId, provider, signer);
    const [contractAddress, tokenId] = values.fractionId.split("-");

    if (!contractAddress || !isAddress(contractAddress)) {
      toast({
        title: "Error",
        description: "Invalid contract address",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    let tokenIdBigInt: BigInt | undefined;
    try {
      tokenIdBigInt = BigInt(tokenId);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Error parsing token ID",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!tokenIdBigInt) {
      toast({
        title: "Error",
        description: "Invalid token ID",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    // TODO: Fix typing issue with provider
    // @ts-ignore
    const lr = new LooksRare(chainId, provider as unknown as Provider, signer);
    const order: Order = {
      collection: contractAddress,
      collectionType: 2,
      strategyId: 0,
      subsetNonce: 0, // keep 0 if you don't know what it is used for
      orderNonce: 0, // You need to retrieve this value from the API
      startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
      endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
      price: parseEther(values.price), // Be careful to use a price in wei, this example is for 1 ETH
      itemIds: [tokenIdBigInt.toString(10)], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
      additionalParams: "0x",
      amounts: [1],
    };

    let signature: string | undefined;

    try {
      setStep("Create");
      const { maker, isCollectionApproved, isTransferManagerApproved } =
        await lr.createMakerAsk(order);

      // Grant the TransferManager the right the transfer assets on behalf od the LooksRareProtocol
      setStep("Approve transfer manager");
      if (!isTransferManagerApproved) {
        const tx = await lr.grantTransferManagerApproval().call();
        await tx.wait();
      }

      setStep("Approve collection");
      // Approve the collection items to be transferred by the TransferManager
      if (!isCollectionApproved) {
        const tx = await lr.approveAllCollectionItems(maker.collection);
        await tx.wait();
      }

      // Sign your maker order
      setStep("Sign order");
      signature = await lr.signMakerOrder(maker);
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not sign order",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error(e);
      onClose();
      return;
    }

    if (!signature) {
      toast({
        title: "Error",
        description: "Could not sign order",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      return;
    }

    try {
      setStep("Create order");
      await createOrder({
        order,
        signature: signature!,
        signer: address,
        globalNonce: 0,
        quoteType: QuoteType.Ask,
        currency: zeroAddress,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not create order",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      console.error(e);
      return;
    }
    console.log(values);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.fractionId}>
        <FormLabel htmlFor="fractionId">Fraction ID</FormLabel>
        <Input
          id="fractionId"
          placeholder="Fraction ID"
          {...register("fractionId", { required: true })}
        />
        <FormErrorMessage>
          {errors.fractionId && "Fraction ID is required"}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.price}>
        <FormLabel htmlFor="price">Price</FormLabel>
        <Input
          id="price"
          placeholder="Price"
          {...register("price", { required: true })}
        />
        <FormErrorMessage>
          {errors.price && "Price is required"}
        </FormErrorMessage>
      </FormControl>
      <Button type="submit">Put on sale</Button>
    </form>
  );
};
