import { useAccount } from "wagmi";

export const useAddress = () => {
  const { address } = useAccount();
  return address?.toLowerCase();
};
