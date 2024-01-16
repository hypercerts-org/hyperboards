import { useRouter } from "next/router";
import { ThankYou } from "@/components/zuconnect-retroactive-fund/thank-you";
import { DonationForm } from "@/components/zuconnect-retroactive-fund/donation-form";

export const ZuconnectRetroactiveFund = () => {
  const { query } = useRouter();

  const page = query["page"];

  if (page === "thank-you") {
    return <ThankYou />;
  }

  return <DonationForm />;
};
