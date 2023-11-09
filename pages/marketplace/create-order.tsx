import { Heading, VStack } from "@chakra-ui/react";
import { CreateOrderForm } from "@/components/marketplace/create-order-form";

export const Index = () => {
  return (
    <VStack>
      <Heading>Marketplace</Heading>
      <Heading size={"md"}>Sell fraction</Heading>
      <CreateOrderForm />
    </VStack>
  );
};

export default Index;
