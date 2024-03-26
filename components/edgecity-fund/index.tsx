import { useRouter } from "next/router";
import { ThankYou } from "@/components/edgecity-fund/thank-you";
import { DonationForm } from "@/components/edgecity-fund/donation-form";

export const EdgeCityFund = () => {
  const { query } = useRouter();

  const page = query["page"];

  if (page === "thank-you") {
    return <ThankYou />;
  }

  return <DonationForm />;
};
