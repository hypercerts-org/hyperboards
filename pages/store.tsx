import { Store } from "@/components/store";
import {
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RightOutlined } from "@ant-design/icons";
import Head from "next/head";

const StorePage = () => {
  return (
    <>
      <Head>
        <title>Hyperboards - Store</title>
      </Head>
      <Center
        maxWidth={968}
        paddingTop={"80px"}
        flexDirection={"column"}
        alignItems={"flex-start"}
      >
        <HStack mb={8}>
          <Image
            width={"50%"}
            src="https://site-assets.plasmic.app/95cf52bd24b6dc8786beeac22dc73333.png"
          />
          <VStack alignItems={"flex-start"}>
            <Heading fontFamily={"Switzer"}>Funding the Commons</Heading>
            <Text fontFamily={"Switzer"}>
              The Funding the Commons Conference and Hackathon Series brings
              together communities in web2, web3, academia, and philanthropy, to
              address challenges in public goods funding, to explore innovative
              solutions, and to foster collaboration between industry leaders,
              academia, and developers.
            </Text>
            <a href="https://fundingthecommons.io/" target="_blank">
              <Button fontFamily={"Switzer"} rightIcon={<RightOutlined />}>
                Event website
              </Button>
            </a>
          </VStack>
        </HStack>
        <Store />
      </Center>
    </>
  );
};

export default StorePage;
