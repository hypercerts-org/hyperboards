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
  Modal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "@/styles/Edgecity.module.css";

export const HypercertsDetailsModal = ({
  ...modalProps
}: Omit<ModalProps, "children">) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const hypercertsData = [
    {
      title: "Designing and producing the 7-day experience",
      description: "The Edge City team designed the event, found and trained all the production partners, secured top projects to run high quality conference days, did loads of experience design, created the sauna and cold plunge experience, invited the high quality group that came, and more.",
      contributors: "Edge City Denver core organizing team",
      receivingShare: "25% (no cap)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Design",
      description: "I’m an artist, who is helping to create a visual part of Edge City :)",
      contributors: "Olga Kuri",
      receivingShare: "12.5% (cap: 1 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Icebreaker + Social Oneness Day Hackathon Cards",
      description: "We created 100 personalized Icebreaker Metal cards on rush order as a special item for Gary's select folks. We still have ~50% of these and plan to mail them to their owners. We also printed, delivered, and distributed 100 Social Oneness Day Hackathon cards featuring Edge City graphics + Collaborators. This allowed many folks to experience networking onchain with NFC in a self-sovereign way (our users own their accounts via embedded ETH wallets). The total cost of materials was ~$900.",
      contributors: "j4ck",
      receivingShare: "10% (cap: 0.8 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Blockravers - Bus + Artists",
      description: "The blockravers contributed to music curation with its DJs during the days that we were building the bus. Once the bus was built it was brought to edge city (Friday and Saturday) were we hosted parties for all the edge cities attendees.",
      contributors: "blockravers.eth, ManuAlzuru, Danny Carranza",
      receivingShare: "8.75% (cap: 0.7 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Circlularity",
      description: "Circles, Simulations",
      contributors: "Kristian Michail",
      receivingShare: "6.25% (cap: 0.5 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Let's GROW LIVE ",
      description: "First and foremost providing transportation to Gary to ensure he was warmly greeted was a primary focus for me. On Social Oneness Day did an hour of broadcasting from the speaker panel on Web3 Social applications to a wider audience through our broadcasting studio. Being present and available for conversation on Days 1, 2, 3, and 7 to promote the event and REGEN culture in general.",
      contributors: "Will T",
      receivingShare: "6.25% (cap: 0.5 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Music and Vibes Producer",
      description: "I curated music specifically for Edge City, Denver, DJ'd for about 10 hours, Helped curate good vibes and positive energy, supported one of the founders (Gary) with moral support and emotional intelligence support, created a Zen Circle for some of the Edge City Denver participants. ",
      contributors: "Enrico Moses",
      receivingShare: "6.25% (cap: 0.5 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Supporting media relations at Edge City",
      description: "Invited top tier crypto media to give them the low-down on what Edge City is about, including Coindesk, Blockworks, The Defiant, and Cointelegraph",
      contributors: "Caolán Walsh",
      receivingShare: "6.25% (cap: 0.5 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Pictures",
      description: "I tried to capture the vibes and have a closer approach to the moments/people I photographed. I had a couple of technical issues and time constraints, but I hope these registers serve as reminder of how heartful this week was. ",
      contributors: "Livia",
      receivingShare: "3.75% (cap: 0.3 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Yoga Flow",
      description: "I really love bringing in body movement to people, especially throughout a busy conference. I am grateful that I was able to provide a flow on Saturday the second to last day of Edge. It seemed like those who participated needed to release tension throughout their body. I hope it helped :)",
      contributors: "Estefania / NFTMami",
      receivingShare: "3.75% (cap: 0.3 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "ZuAfrique - Venue Setup Volunteers",
      description: "We supported Edge City's venue set-up the weekend before the festivities began. We helped set up the chill zone, carried furniture, and provided any other help that was needed. We believe this helped to get the right ambience, which made Edgecity an amazing experience.",
      contributors: "Eric Annan, Michael Lawal, Pishikeni Tukura",
      receivingShare: "3.75% (cap: 0.3 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Interviews & Documentary",
      description: "I showed up to Denver with new recording equipment and a vague dream: to amplify the voices of emerging creators & leaders. I began interviewing EthDenver hackathoners but switched over to being at EdgeCity nearly the whole time filming interviews, stock footage and a podcast. I am currently editing together a compilation of 10+ 'how was your week at EdgeCity?' mini interviews with venue, event & party footage. This improved the Edge City Denver experience by helping to make it feel more like a Thing, by capturing key moments for the memories of attendees, and most significantly by showcasing the multidimensional high value of Edge City for future residents!",
      contributors: "Bruce Starlove",
      receivingShare: "1.88% (cap: 0.15 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Recommendations for Uniswap's Delegate program",
      description: "I produced multiple recommendations for the Uniswap foundation.",
      contributors: "Zach Zukowski",
      receivingShare: "1.88% (cap: 0.15 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Chill Room Setup",
      description: "Unpacked boxes and materials used in the chill room.",
      contributors: "Darryl Yeo",
      receivingShare: "1.25% (cap: 0.1 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Event Setup",
      description: "I helped with a bit of setup the day before the opening day.",
      contributors: "Xian",
      receivingShare: "1.25% (cap: 0.1 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Curator of Spirits",
      description: "Curated sharp, high vibration peoples to the Edge City!",
      contributors: "ml_sudo",
      receivingShare: "0.63% (cap: 0.05 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
    {
      title: "Promoter",
      description: "I promoted it to at least 50 people and encouraged them to attend as much as possible.",
      contributors: "Izzy",
      receivingShare: "0.63% (cap: 0.05 ETH)",
      imageUrl: "https://hypercerts-test.vercel.app/img/hypercert_example_shadow.png",
    },
  ];

  return (
    <Modal {...modalProps} size={isMobile ? "full" : undefined}>
      <ModalOverlay />
      <ModalContent ref={ref} borderRadius={0} minW={isMobile ? "100%" : 700}>
        <ModalBody p={8}>
          <VStack spacing={6} alignItems="flex-start">
            <Text textDecoration="underline" textAlign="center" w="100%">
              <b>Edge City Denver Hypercerts</b>
            </Text>
            {hypercertsData.map((hypercert, index) => (
              <Box key={index} pb={0}>
                <hr className={styles.hrStyle} />
                <Grid
                  templateColumns={isMobile ? "1fr" : "400px 200px"}
                  gap={4}
                  alignItems="start"
                >
                  <Box>
                    <Heading style={{ fontFamily: '"Inter", sans-serif', fontSize: 'large' }}>
                      {hypercert.title}
                    </Heading>
                    <Text className={styles.hypercertsParagraph}>
                      <strong>Description: </strong> {hypercert.description}
                    </Text>
                    <Text className={styles.hypercertsParagraph}>
                      <strong>Contributor(s): </strong> {hypercert.contributors}
                    </Text>
                    <Text className={styles.hypercertsParagraph}>
                      <strong>Receiving share: </strong> {hypercert.receivingShare}
                    </Text>
                  </Box>
                  <Box
                    maxW={isMobile ? "300px" : undefined}
                    mx={isMobile ? "200px" : undefined}
                  >
                    <Image src={hypercert.imageUrl} alt={hypercert.title} />
                  </Box>
                </Grid>
              </Box>
            ))}
            <Button mx="auto" onClick={modalProps.onClose} bg="#41645F" color="white">
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
