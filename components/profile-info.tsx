import { useEnsAvatar, useEnsName } from "wagmi";
import { Avatar, Flex, Text, VStack } from "@chakra-ui/react";
import { formatAddress } from "@/utils/formatting";
import React from "react";

export const ProfileInfo = ({ address }: { address: string }) => {
  const { data: avatarData } = useEnsAvatar();
  const { data: ensName } = useEnsName({});

  const formattedAddress = formatAddress(address);
  const name = ensName ?? formattedAddress;

  return (
    <Flex
      height={"100%"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <Avatar
        src={avatarData || undefined}
        width={8}
        height={8}
        borderRadius={"8px"}
        mr={2}
      />
      <VStack alignItems={"flex-start"} spacing={0}>
        {name && (
          <Text fontWeight={500} fontSize={"xs"}>
            {name}
          </Text>
        )}
        {address && (
          <Text fontSize={"xs"} opacity={0.5}>
            {formattedAddress}
          </Text>
        )}
      </VStack>
    </Flex>
  );
};
