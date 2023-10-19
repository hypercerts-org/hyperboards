import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { CreateHyperboardModal } from "@/components/admin/create-hyperboard-modal";
import { useMyHyperboards } from "@/hooks/useMyHyperboards";

export const HyperboardsAdmin = () => {
  const {
    isOpen: createIsOpen,
    onClose: createOnClose,
    onOpen: createOnOpen,
  } = useDisclosure();

  const { data } = useMyHyperboards();

  return (
    <>
      <Button variant={"solid"} colorScheme="blue" onClick={createOnOpen}>
        Create Hyperboard
      </Button>

      <Flex minHeight={"100%"} flexDirection={"column"}>
        {data?.data?.map((hyperboard) => (
          <div key={hyperboard.id}>{hyperboard.name}</div>
        ))}
      </Flex>
      <CreateHyperboardModal isOpen={createIsOpen} onClose={createOnClose} />
    </>
  );
};
