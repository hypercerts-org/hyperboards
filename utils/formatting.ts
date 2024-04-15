import { format } from "date-fns";
export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatRenderMethodReadableName = (renderMethod: string) => {
  switch (renderMethod) {
    case "full":
      return "Full";
    case "image-only":
      return "Image Only";
    default:
      return "Unknown";
  }
};

export const formatWorkTimeframe = (timeStamps?: number[]) => {
  if (!timeStamps) {
    return "";
  }
  const dateFormat = "dd MMM yyyy";
  const start = new Date(timeStamps[0] * 1000);
  const end = new Date(timeStamps[1] * 1000);
  return `${format(start, dateFormat)} - ${format(end, dateFormat)}`;
};

export const formatStrategyType = (strategyType: number) => {
  switch (strategyType) {
    case 0:
      return "Standard";
    case 1:
      return "Collection";
    case 2:
      return "Collection with Merkle Tree";
    case 4:
      return "Dutch Auction";
    case 5:
      return "Item IDs Range";
    case 6:
      return "Hypercert Collection Offer";
    case 7:
      return "Hypercert Collection Offer with Proof";
    case 8:
      return "Hypercert Collection Offer with Allowlist";
    case 9:
      return "Hypercert Dutch Auction";
    case 10:
      return "Hypercert Fraction Offer";
    case 11:
      return "Hypercert Fraction Offer with Allowlist";
    default:
      return "Unknown";
  }
};

export const chainIdToName = (chainId: number) => {
  switch (chainId) {
    case 10:
      return "Optimism";
    case 11155111:
      return "Sepolia";
    case 84532:
      return "Base Sepolia";
    case 8453:
      return "Base Mainnet";
    case 42220:
      return "Celo";
    default:
      return `Chain ID ${chainId}`;
  }
};
