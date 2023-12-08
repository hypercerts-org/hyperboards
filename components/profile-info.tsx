import { useEnsAvatar, useEnsName } from "wagmi";
import { Flex, Image, Text, VStack } from "@chakra-ui/react";
import { formatAddress } from "@/utils/formatting";
import React from "react";

export const ProfileInfo = ({ address }: { address: string }) => {
  const { data: avatarData } = useEnsAvatar();
  const { data: ensName } = useEnsName();

  return (
    <Flex
      height={"100%"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      {avatarData && (
        <Image
          alt={ensName ?? "Avatar"}
          src={avatarData}
          width={8}
          height={8}
          borderRadius={999}
          mr={2}
        />
      )}
      <VStack alignItems={"flex-start"} spacing={0}>
        {ensName && <Text fontWeight={500}>{ensName}</Text>}
        {address && <Text fontSize={"xs"}>{formatAddress(address)}</Text>}
      </VStack>
    </Flex>
  );
};
