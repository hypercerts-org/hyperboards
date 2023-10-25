import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";

export const ConnectWalletAlert = ({
  description,
}: {
  description?: string;
}) => {
  return (
    <Alert status="info">
      <AlertIcon />
      <AlertTitle mr={2}>Connect your wallet</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};
