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
