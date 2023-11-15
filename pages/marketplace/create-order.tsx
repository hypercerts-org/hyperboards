import { Heading, VStack } from "@chakra-ui/react";
import { CreateOrderForm } from "@/components/marketplace/create-order-form";

export const Index = () => {
  return (
    <VStack spacing={4}>
      <Heading>Marketplace</Heading>
      <CreateOrderForm />
      {/*<AvailableOrders />*/}
    </VStack>
  );
};

export default Index;
