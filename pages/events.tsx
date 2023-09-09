import { useListRegistries } from "@/hooks/registry";
import Link from "next/link";
import { Center, Heading, Spinner, VStack } from "@chakra-ui/react";

const EventsPage = () => {
  const { data, isLoading } = useListRegistries();

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!data?.data) {
    return <div>No data found</div>;
  }

  return (
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
  );
};

export default EventsPage;
