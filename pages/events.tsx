import { useListRegistries } from "@/hooks/registry";
import Link from "next/link";
import { Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import Head from "next/head";

const EventsPage = () => {
  const { data, isLoading } = useListRegistries();

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Hyperboards - Events</title>
        </Head>
        <Center>
          <Spinner />
        </Center>
      </>
    );
  }

  if (!data?.data) {
    return <div>No data found</div>;
  }

  return (
    <>
      <Head>
        <title>Hyperboards - Events</title>
      </Head>
      <VStack
        maxW={968}
        width={"100%"}
        flexDirection={"column"}
        alignItems={"flex-start"}
      >
        <Heading fontFamily={"Switzer"} size={"lg"}>
          Archive
        </Heading>
        <VStack alignItems={"flex-start"}>
          {data.data.map((registry) => (
            <Link key={registry.id} href={`/board/${registry.id}`}>
              <Heading fontFamily={"Switzer"} size={"sm"}>
                {registry.name}
              </Heading>
            </Link>
          ))}
        </VStack>
      </VStack>
    </>
  );
};

export default EventsPage;
