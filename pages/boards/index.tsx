import { supabase } from "@/lib/supabase";
import { Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import { HyperboardEntity } from "@/types/database-entities";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export const Index = () => {
  const { data, isLoading } = useQuery(["all-boards"], async () =>
    supabase.from("hyperboards").select("*"),
  );

  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    );
  }

  if (!data || !data.data?.length) {
    return (
      <Center py={8}>
        <Heading textStyle={"secondary"}>No boards found</Heading>
      </Center>
    );
  }

  return (
    <Center py={8}>
      <VStack spacing={4}>
        {data.data.map((board: HyperboardEntity) => (
          <Link href={`/boards/${board.id}`} key={board.id}>
            <Heading size={"lg"} textStyle={"secondary"}>
              {board.name}
            </Heading>
          </Link>
        ))}
      </VStack>
    </Center>
  );
};

export default Index;
