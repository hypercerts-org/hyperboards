import { Card, Flex, VStack } from "@chakra-ui/react";
import { CreateOrUpdateBlueprintForm } from "@/components/forms/create-or-update-blueprint-form";

export const BlueprintsAdmin = () => {
  return (
    <Flex direction={"column"} width={"100%"}>
      <VStack minHeight={"100%"} spacing={4} alignItems={"flex-start"}>
        <Card p={4}>
          <CreateOrUpdateBlueprintForm onSubmit={(e) => console.log(e)} />
        </Card>
      </VStack>
    </Flex>
  );
};
