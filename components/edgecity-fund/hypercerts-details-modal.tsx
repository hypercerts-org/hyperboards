import {
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/modal";
import {
  Box,
  Button,
  Grid,
  Heading,
  Image,
  ListItem,
  Modal,
  OrderedList,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { EDGECITY_DONATION_SAFE_ADDRESS } from "@/config";

export const HypercertsDetailsModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const hasRef = !!ref.current;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!hasRef) {
      return;
    }
    if (modalProps.isOpen) {
      window.document.body.scroll(0, 0);
      ref.current.scrollTop = 0;
    }
  }, [modalProps.isOpen, hasRef]);

  return (
    <Modal {...modalProps} size={isMobile ? "full" : undefined}>
      <ModalOverlay />
      <ModalContent ref={ref} borderRadius={0} minW={isMobile ? "100%" : 700}>
        <ModalBody p={8}>
          <VStack
            spacing={6}
            textUnderlineOffset={"2px"}
            alignItems={"flex-start"}
          >
            <Text textDecoration={"underline"} textAlign={"center"} w={"100%"}>
              <b>Edge City Denver Hypercerts</b>
            </Text>
            <Grid
              templateColumns={{ sm: '1fr', md: '1fr 1fr' }}
              gap={6}
            >
              {/* First Column, First Item */}
              <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
                <Image src="https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png" alt="Placeholder 1" style={{ maxWidth: '200px' }} />
              </Box>
              
              {/* Second Column, First Item */}
              <Box w="100%" h="100%">
                <Heading fontSize={"xl"}>Hypercert name</Heading>
                <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
                enim ad minim veniam, quis nostrud exercitation ullamco.
              </Box>
              
              {/* First Column, Second Item (If you want this centered as well, apply the same styling as the first box) */}
              <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
                <Image src="https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png" alt="Placeholder 2" style={{ maxWidth: '200px' }} />
              </Box>
              
              {/* Second Column, Second Item */}
              <Box w="100%" h="100%">
                <Heading fontSize={"xl"}>Hypercert name</Heading>
                <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
                enim ad minim veniam, quis nostrud exercitation ullamco.
              </Box>
            </Grid>
            <Button
              mx={"auto"}
              onClick={modalProps.onClose}
              bg={"#41645F"}
              color={"white"}
            >
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
