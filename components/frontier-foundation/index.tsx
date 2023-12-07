import { useRouter } from "next/router";
import { ThankYou } from "@/components/frontier-foundation/thank-you";
import { FrontierMintingForm } from "@/components/frontier-foundation/frontier-minting-form";

export const FrontierFoundation = () => {
  const { query } = useRouter();

  const page = query["page"];

  if (page === "thank-you") {
    return <ThankYou />;
  }

  return <FrontierMintingForm />;
};
