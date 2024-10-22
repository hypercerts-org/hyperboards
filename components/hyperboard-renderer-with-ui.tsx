import { useState } from "react";
import { useFetchHyperboardContents } from "@/hooks/useFetchHyperboardContents";
import { Center, Flex, IconButton, Spinner, VStack } from "@chakra-ui/react";
import * as React from "react";
import Head from "next/head";
import { BreadcrumbEntry, Breadcrumbs } from "@/components/breadcrumbs";
import { OwnershipTable } from "@/components/hyperboard/ownership-table";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { useRouter } from "next/router";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";
import { useFetchHyperboardById } from "@/hooks/useFetchHyperboardContents2";
import { HypercertClientProvider } from "@/components/providers";

const HyperboardRendererWithUiInternal = ({
  hyperboardId,
}: {
  hyperboardId: string;
}) => {
  const { push, query } = useRouter();

  const [selectedCollection, setSelectedCollection] = useState<string>();

  const { data } = useFetchHyperboardContents(hyperboardId);
  const hyperboard = data?.hyperboard;

  const fullScreen = query.fullScreen === "true";
  const toggleFullScreen = async () => {
    if (!fullScreen) {
      await push({
        pathname: `/boards/${hyperboardId}`,
        query: {
          fullScreen: true,
        },
      });
    } else {
      await push({
        pathname: `/boards/${hyperboardId}`,
        query: {
          fullScreen: false,
        },
      });
    }
  };

  const crumbs: BreadcrumbEntry[] = [];

  if (hyperboard) {
    crumbs.push({
      id: hyperboard.id,
      name: hyperboard.name,
      onClick: () => setSelectedCollection(undefined),
    });
  }

  if (selectedCollection) {
    const registry = hyperboard?.hyperboard_registries.find(
      (x) => x.registries?.id === selectedCollection,
    );
    if (registry?.registries) {
      crumbs.push({
        name: registry.registries?.name,
        onClick: () => {},
        isActive: true,
        id: registry.registries?.id,
      });
    }
  }

  // TODO: Add start breadcrumb with company icon
  // TODO: Add second breadcrumb with company name

  return (
    <>
      <Head>
        {hyperboard?.name ? (
          <title>Hyperboards - {hyperboard.name}</title>
        ) : (
          <title>Hyperboards - Loading</title>
        )}
      </Head>

      <Center flexDirection={"column"} width={"100%"} paddingX={[0, 0, "80px"]}>
        <VStack width={"100%"}>
          <Flex justifyContent={"flex-start"} width={"100%"}>
            <Breadcrumbs crumbs={crumbs} />
          </Flex>
          <Flex width={"100%"} position={"relative"}>
            <HyperboardRenderer
              hyperboardId={hyperboardId}
              fullScreen={fullScreen}
              onSelectedRegistryChange={setSelectedCollection}
              selectedRegistryParent={selectedCollection}
            />
            <IconButton
              variant={"blackAndWhiteOutline"}
              aria-label="Expand"
              onClick={toggleFullScreen}
              icon={
                fullScreen ? (
                  <MdOutlineFullscreenExit />
                ) : (
                  <MdOutlineFullscreen />
                )
              }
              position={"absolute"}
              borderRadius={"full"}
              bottom={"10px"}
              border={"1px solid black"}
              right={"10px"}
            />
          </Flex>
        </VStack>
        {hyperboard && (
          <OwnershipTable
            hyperboardId={hyperboard.id}
            showHeader
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
          />
        )}
      </Center>
    </>
  );
};

export const HyperboardRendererWithUi = ({
  hyperboardId,
}: {
  hyperboardId: string;
}) => {
  const { data, isLoading } = useFetchHyperboardById(hyperboardId);

  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    );
  }

  if (!data) {
    return null;
  }

  const chainId = data.chain_ids?.[0];

  if (!chainId) {
    return null;
  }

  return (
    <HypercertClientProvider chainOverride={Number(chainId)}>
      <HyperboardRendererWithUiInternal hyperboardId={hyperboardId} />
    </HypercertClientProvider>
  );
};
