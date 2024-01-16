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
