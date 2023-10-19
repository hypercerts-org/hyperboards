import {
  Button,
  Card,
  Flex,
  Heading,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { CreateHyperboardModal } from "@/components/admin/create-hyperboard-modal";
import { useMyHyperboards } from "@/hooks/useMyHyperboards";
import { HyperboardEntity } from "@/types/database-entities";

export const HyperboardsAdmin = () => {
  const {
    isOpen: createIsOpen,
    onClose: createOnClose,
    onOpen: createOnOpen,
  } = useDisclosure();

  const { data } = useMyHyperboards();

  return (
    <Flex direction={"column"}>
      <VStack minHeight={"100%"} spacing={4} alignItems={"flex-start"}>
        <Button
          variant={"solid"}
          size={"md"}
          colorScheme="blue"
          onClick={createOnOpen}
        >
          Create Hyperboard
        </Button>
        {data?.data?.map((hyperboard) => (
          <HyperboardAdminRow key={hyperboard.id} hyperboard={hyperboard} />
        ))}
      </VStack>
      <CreateHyperboardModal isOpen={createIsOpen} onClose={createOnClose} />
    </Flex>
  );
};

const HyperboardAdminRow = ({
  hyperboard,
}: {
  hyperboard: HyperboardEntity;
}) => {
  return (
    <Card p={4}>
      <Heading>{hyperboard.name}</Heading>
    </Card>
  );
};
