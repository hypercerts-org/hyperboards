import {
  Button,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { decodeErrorResult, formatEther } from "viem";
import { useFetchMarketplaceOrders } from "@/hooks/marketplace/useFetchMarketplaceOrders";
import { LooksRare } from "@hypercerts-org/marketplace-sdk";
import { useChainId, useWalletClient } from "wagmi";
import {
  useEthersProvider,
  useEthersSigner,
} from "@/components/marketplace/create-order-form";
import { useInteractionModal } from "@/components/interaction-modal";
import { waitForTransactionReceipt } from "viem/actions";
import { isObject } from "lodash";

export const AvailableOrders = () => {
  const { data, isLoading } = useFetchMarketplaceOrders();
  const chainId = useChainId();
  const provider = useEthersProvider();
  const toast = useToast();
  const signer = useEthersSigner();
  const { setStep, onOpen, onClose } = useInteractionModal();
  const { data: walletClientData } = useWalletClient();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VStack>
      <Heading size={"md"}>Available orders</Heading>
      {data?.data?.length ? (
        <TableContainer>
          <Table variant={"striped"} size={"sm"} colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Order Type</Th>
                <Th>Order Price</Th>
                <Th>Created at</Th>
                <Th>Collection</Th>
                <Th>Token</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.data.map((order) => {
                const itemIds = Array.isArray(order.itemIds)
                  ? (order.itemIds as string[])
                  : null;
                const amounts = Array.isArray(order.amounts)
                  ? (order.amounts as number[])
                  : null;
                const onBuy = async () => {
                  if (!chainId) {
                    toast({
                      title: "No chain id",
                      description: "No chain id",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    onClose();
                    return;
                  }
                  if (!itemIds) {
                    toast({
                      title: "No item ids",
                      description: "No item ids",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    onClose();
                    return;
                  }
                  if (!amounts) {
                    toast({
                      title: "No amounts",
                      description: "No amounts",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    onClose();
                    return;
                  }

                  if (!walletClientData) {
                    toast({
                      title: "No wallet client data",
                      description: "No wallet client data",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    onClose();
                    return;
                  }

                  const makerOrder = {
                    ...order,
                    itemIds,
                    amounts,
                  };

                  onOpen([
                    {
                      title: "Setting up order execution",
                      description: "Setting up order execution",
                    },
                    {
                      title: "Setting approval",
                      description: "Setting approval",
                    },
                    {
                      title: "Awaiting buy signature",
                      description: "Awaiting buy signature",
                    },

                    {
                      title: "Awaiting confirmation",
                      description: "Awaiting confirmation",
                    },
                  ]);
                  // @ts-ignore
                  const lr = new LooksRare(chainId, provider, signer);
                  setStep("Setting up order execution");
                  const takerOrder = lr.createTaker(makerOrder);

                  try {
                    setStep("Setting approval");
                    const approveTx = await lr.approveErc20(lr.addresses.WETH);
                    await waitForTransactionReceipt(walletClientData, {
                      hash: approveTx.hash as `0x${string}`,
                    });
                  } catch (e) {
                    console.error(e);
                    toast({
                      title: "Approval error",
                      description: "Approval couldn't be set",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    onClose();
                  }

                  try {
                    setStep("Setting up order execution");
                    const { call } = lr.executeOrder(
                      makerOrder,
                      takerOrder,
                      order.signature,
                    );
                    setStep("Awaiting buy signature");
                    const tx = await call();
                    setStep("Awaiting confirmation");
                    const receipt = await waitForTransactionReceipt(
                      walletClientData,
                      {
                        hash: tx.hash as `0x${string}`,
                      },
                    );
                    console.log(receipt);
                    toast({
                      title: "Order executed",
                      description: "Order executed",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                  } catch (e) {
                    console.error(e);
                    let description = "Order execution error";
                    if (isObject(e)) {
                      const decodedError = decodeErrorResult({
                        abi: looksRareABI,
                        data: (e as any).error?.data?.originalError?.data,
                      });
                      description = decodedError?.errorName || description;
                    }

                    toast({
                      title: "Order execution error",
                      description,
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                  onClose();
                };
                return (
                  <Tr key={order.id}>
                    <Td>{order.id}</Td>
                    <Td>{order.quoteType}</Td>
                    <Td>{formatEther(BigInt(order.price))}</Td>
                    <Td>{order.createdAt}</Td>
                    <Td>{order.collection}</Td>
                    <Td>{itemIds?.[0]}</Td>
                    <Td>
                      <Button colorScheme="teal" onClick={() => onBuy()}>
                        Buy
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Heading size={"md"}>No orders available</Heading>
      )}
    </VStack>
  );
};

const looksRareABI = [
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      {
        internalType: "address",
        name: "_protocolFeeRecipient",
        type: "address",
      },
      { internalType: "address", name: "_transferManager", type: "address" },
      { internalType: "address", name: "_weth", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "CallerInvalid", type: "error" },
  { inputs: [], name: "ChainIdInvalid", type: "error" },
  { inputs: [], name: "CreatorFeeBpTooHigh", type: "error" },
  { inputs: [], name: "CurrencyInvalid", type: "error" },
  { inputs: [], name: "ERC20TransferFromFail", type: "error" },
  { inputs: [], name: "LengthsInvalid", type: "error" },
  { inputs: [], name: "MerkleProofInvalid", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "length", type: "uint256" }],
    name: "MerkleProofTooLarge",
    type: "error",
  },
  { inputs: [], name: "NewGasLimitETHTransferTooLow", type: "error" },
  {
    inputs: [],
    name: "NewProtocolFeeRecipientCannotBeNullAddress",
    type: "error",
  },
  { inputs: [], name: "NoOngoingTransferInProgress", type: "error" },
  { inputs: [], name: "NoSelectorForStrategy", type: "error" },
  { inputs: [], name: "NoncesInvalid", type: "error" },
  { inputs: [], name: "NotAContract", type: "error" },
  { inputs: [], name: "NotOwner", type: "error" },
  { inputs: [], name: "NotV2Strategy", type: "error" },
  { inputs: [], name: "NullSignerAddress", type: "error" },
  { inputs: [], name: "OutsideOfTimeRange", type: "error" },
  { inputs: [], name: "QuoteTypeInvalid", type: "error" },
  { inputs: [], name: "ReentrancyFail", type: "error" },
  { inputs: [], name: "RenouncementNotInProgress", type: "error" },
  { inputs: [], name: "SameDomainSeparator", type: "error" },
  { inputs: [], name: "SignatureEOAInvalid", type: "error" },
  { inputs: [], name: "SignatureERC1271Invalid", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "length", type: "uint256" }],
    name: "SignatureLengthInvalid",
    type: "error",
  },
  { inputs: [], name: "SignatureParameterSInvalid", type: "error" },
  {
    inputs: [{ internalType: "uint8", name: "v", type: "uint8" }],
    name: "SignatureParameterVInvalid",
    type: "error",
  },
  { inputs: [], name: "StrategyHasNoSelector", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "strategyId", type: "uint256" }],
    name: "StrategyNotAvailable",
    type: "error",
  },
  { inputs: [], name: "StrategyNotUsed", type: "error" },
  { inputs: [], name: "StrategyProtocolFeeTooHigh", type: "error" },
  { inputs: [], name: "TransferAlreadyInProgress", type: "error" },
  { inputs: [], name: "TransferNotInProgress", type: "error" },
  { inputs: [], name: "UnsupportedCollectionType", type: "error" },
  { inputs: [], name: "WrongPotentialOwner", type: "error" },
  {
    anonymous: false,
    inputs: [],
    name: "CancelOwnershipTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "currency",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "isAllowed", type: "bool" },
    ],
    name: "CurrencyStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "InitiateOwnershipRenouncement",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "potentialOwner",
        type: "address",
      },
    ],
    name: "InitiateOwnershipTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidNonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "askNonce",
        type: "uint256",
      },
    ],
    name: "NewBidAskNonces",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "creatorFeeManager",
        type: "address",
      },
    ],
    name: "NewCreatorFeeManager",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "NewDomainSeparator", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gasLimitETHTransfer",
        type: "uint256",
      },
    ],
    name: "NewGasLimitETHTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "maxCreatorFeeBp",
        type: "uint256",
      },
    ],
    name: "NewMaxCreatorFeeBp",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "NewOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "protocolFeeRecipient",
        type: "address",
      },
    ],
    name: "NewProtocolFeeRecipient",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "standardProtocolFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "minTotalFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "maxProtocolFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isMakerBid",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "NewStrategy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "orderNonces",
        type: "uint256[]",
      },
    ],
    name: "OrderNoncesCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "isActive", type: "bool" },
      {
        indexed: false,
        internalType: "uint16",
        name: "standardProtocolFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "minTotalFeeBp",
        type: "uint16",
      },
    ],
    name: "StrategyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "subsetNonces",
        type: "uint256[]",
      },
    ],
    name: "SubsetNoncesCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "orderHash", type: "bytes32" },
          { internalType: "uint256", name: "orderNonce", type: "uint256" },
          { internalType: "bool", name: "isNonceInvalidated", type: "bool" },
        ],
        indexed: false,
        internalType: "struct ILooksRareProtocol.NonceInvalidationParameters",
        name: "nonceInvalidationParameters",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "askUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "itemIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address[2]",
        name: "feeRecipients",
        type: "address[2]",
      },
      {
        indexed: false,
        internalType: "uint256[3]",
        name: "feeAmounts",
        type: "uint256[3]",
      },
    ],
    name: "TakerAsk",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "orderHash", type: "bytes32" },
          { internalType: "uint256", name: "orderNonce", type: "uint256" },
          { internalType: "bool", name: "isNonceInvalidated", type: "bool" },
        ],
        indexed: false,
        internalType: "struct ILooksRareProtocol.NonceInvalidationParameters",
        name: "nonceInvalidationParameters",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidRecipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "itemIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address[2]",
        name: "feeRecipients",
        type: "address[2]",
      },
      {
        indexed: false,
        internalType: "uint256[3]",
        name: "feeAmounts",
        type: "uint256[3]",
      },
    ],
    name: "TakerBid",
    type: "event",
  },
  {
    inputs: [],
    name: "MAGIC_VALUE_ORDER_NONCE_EXECUTED",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "standardProtocolFeeBp", type: "uint16" },
      { internalType: "uint16", name: "minTotalFeeBp", type: "uint16" },
      { internalType: "uint16", name: "maxProtocolFeeBp", type: "uint16" },
      { internalType: "bytes4", name: "selector", type: "bytes4" },
      { internalType: "bool", name: "isMakerBid", type: "bool" },
      { internalType: "address", name: "implementation", type: "address" },
    ],
    name: "addStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "orderNonces", type: "uint256[]" },
    ],
    name: "cancelOrderNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelOwnershipTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "subsetNonces", type: "uint256[]" },
    ],
    name: "cancelSubsetNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "chainId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmOwnershipRenouncement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmOwnershipTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "creatorFeeManager",
    outputs: [
      {
        internalType: "contract ICreatorFeeManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "domainSeparator",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "recipient", type: "address" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker[]",
        name: "takerBids",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "enum QuoteType", name: "quoteType", type: "uint8" },
          { internalType: "uint256", name: "globalNonce", type: "uint256" },
          { internalType: "uint256", name: "subsetNonce", type: "uint256" },
          { internalType: "uint256", name: "orderNonce", type: "uint256" },
          { internalType: "uint256", name: "strategyId", type: "uint256" },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          { internalType: "address", name: "collection", type: "address" },
          { internalType: "address", name: "currency", type: "address" },
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "uint256[]", name: "itemIds", type: "uint256[]" },
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker[]",
        name: "makerAsks",
        type: "tuple[]",
      },
      { internalType: "bytes[]", name: "makerSignatures", type: "bytes[]" },
      {
        components: [
          { internalType: "bytes32", name: "root", type: "bytes32" },
          {
            components: [
              { internalType: "bytes32", name: "value", type: "bytes32" },
              {
                internalType: "enum OrderStructs.MerkleTreeNodePosition",
                name: "position",
                type: "uint8",
              },
            ],
            internalType: "struct OrderStructs.MerkleTreeNode[]",
            name: "proof",
            type: "tuple[]",
          },
        ],
        internalType: "struct OrderStructs.MerkleTree[]",
        name: "merkleTrees",
        type: "tuple[]",
      },
      { internalType: "bool", name: "isAtomic", type: "bool" },
    ],
    name: "executeMultipleTakerBids",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "recipient", type: "address" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker",
        name: "takerAsk",
        type: "tuple",
      },
      {
        components: [
          { internalType: "enum QuoteType", name: "quoteType", type: "uint8" },
          { internalType: "uint256", name: "globalNonce", type: "uint256" },
          { internalType: "uint256", name: "subsetNonce", type: "uint256" },
          { internalType: "uint256", name: "orderNonce", type: "uint256" },
          { internalType: "uint256", name: "strategyId", type: "uint256" },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          { internalType: "address", name: "collection", type: "address" },
          { internalType: "address", name: "currency", type: "address" },
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "uint256[]", name: "itemIds", type: "uint256[]" },
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker",
        name: "makerBid",
        type: "tuple",
      },
      { internalType: "bytes", name: "makerSignature", type: "bytes" },
      {
        components: [
          { internalType: "bytes32", name: "root", type: "bytes32" },
          {
            components: [
              { internalType: "bytes32", name: "value", type: "bytes32" },
              {
                internalType: "enum OrderStructs.MerkleTreeNodePosition",
                name: "position",
                type: "uint8",
              },
            ],
            internalType: "struct OrderStructs.MerkleTreeNode[]",
            name: "proof",
            type: "tuple[]",
          },
        ],
        internalType: "struct OrderStructs.MerkleTree",
        name: "merkleTree",
        type: "tuple",
      },
    ],
    name: "executeTakerAsk",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "recipient", type: "address" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker",
        name: "takerBid",
        type: "tuple",
      },
      {
        components: [
          { internalType: "enum QuoteType", name: "quoteType", type: "uint8" },
          { internalType: "uint256", name: "globalNonce", type: "uint256" },
          { internalType: "uint256", name: "subsetNonce", type: "uint256" },
          { internalType: "uint256", name: "orderNonce", type: "uint256" },
          { internalType: "uint256", name: "strategyId", type: "uint256" },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          { internalType: "address", name: "collection", type: "address" },
          { internalType: "address", name: "currency", type: "address" },
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "uint256[]", name: "itemIds", type: "uint256[]" },
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker",
        name: "makerAsk",
        type: "tuple",
      },
      { internalType: "bytes", name: "makerSignature", type: "bytes" },
      {
        components: [
          { internalType: "bytes32", name: "root", type: "bytes32" },
          {
            components: [
              { internalType: "bytes32", name: "value", type: "bytes32" },
              {
                internalType: "enum OrderStructs.MerkleTreeNodePosition",
                name: "position",
                type: "uint8",
              },
            ],
            internalType: "struct OrderStructs.MerkleTreeNode[]",
            name: "proof",
            type: "tuple[]",
          },
        ],
        internalType: "struct OrderStructs.MerkleTree",
        name: "merkleTree",
        type: "tuple",
      },
    ],
    name: "executeTakerBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "root", type: "bytes32" },
      { internalType: "uint256", name: "proofLength", type: "uint256" },
    ],
    name: "hashBatchOrder",
    outputs: [
      { internalType: "bytes32", name: "batchOrderHash", type: "bytes32" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bool", name: "bid", type: "bool" },
      { internalType: "bool", name: "ask", type: "bool" },
    ],
    name: "incrementBidAskNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initiateOwnershipRenouncement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newPotentialOwner", type: "address" },
    ],
    name: "initiateOwnershipTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isCurrencyAllowed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxCreatorFeeBp",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownershipStatus",
    outputs: [
      { internalType: "enum IOwnableTwoSteps.Status", name: "", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "potentialOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeeRecipient",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "recipient", type: "address" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker",
        name: "takerBid",
        type: "tuple",
      },
      {
        components: [
          { internalType: "enum QuoteType", name: "quoteType", type: "uint8" },
          { internalType: "uint256", name: "globalNonce", type: "uint256" },
          { internalType: "uint256", name: "subsetNonce", type: "uint256" },
          { internalType: "uint256", name: "orderNonce", type: "uint256" },
          { internalType: "uint256", name: "strategyId", type: "uint256" },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          { internalType: "address", name: "collection", type: "address" },
          { internalType: "address", name: "currency", type: "address" },
          { internalType: "address", name: "signer", type: "address" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "uint256[]", name: "itemIds", type: "uint256[]" },
          { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker",
        name: "makerAsk",
        type: "tuple",
      },
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "bytes32", name: "orderHash", type: "bytes32" },
    ],
    name: "restrictedExecuteTakerBid",
    outputs: [
      { internalType: "uint256", name: "protocolFeeAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "strategyInfo",
    outputs: [
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "uint16", name: "standardProtocolFeeBp", type: "uint16" },
      { internalType: "uint16", name: "minTotalFeeBp", type: "uint16" },
      { internalType: "uint16", name: "maxProtocolFeeBp", type: "uint16" },
      { internalType: "bytes4", name: "selector", type: "bytes4" },
      { internalType: "bool", name: "isMakerBid", type: "bool" },
      { internalType: "address", name: "implementation", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "transferManager",
    outputs: [
      { internalType: "contract TransferManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newCreatorFeeManager",
        type: "address",
      },
    ],
    name: "updateCreatorFeeManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "currency", type: "address" },
      { internalType: "bool", name: "isAllowed", type: "bool" },
    ],
    name: "updateCurrencyStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateDomainSeparator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newGasLimitETHTransfer",
        type: "uint256",
      },
    ],
    name: "updateETHGasLimitForTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16", name: "newMaxCreatorFeeBp", type: "uint16" },
    ],
    name: "updateMaxCreatorFeeBp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newProtocolFeeRecipient",
        type: "address",
      },
    ],
    name: "updateProtocolFeeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "strategyId", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
      {
        internalType: "uint16",
        name: "newStandardProtocolFee",
        type: "uint16",
      },
      { internalType: "uint16", name: "newMinTotalFee", type: "uint16" },
    ],
    name: "updateStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "userBidAskNonces",
    outputs: [
      { internalType: "uint256", name: "bidNonce", type: "uint256" },
      { internalType: "uint256", name: "askNonce", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userOrderNonce",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userSubsetNonce",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;