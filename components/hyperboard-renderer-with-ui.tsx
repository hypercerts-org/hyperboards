import { useRef, useState } from "react";
import { useSize } from "@chakra-ui/react-use-size";
import {
  registryContentItemToHyperboardEntry,
  useFetchHyperboardContents,
} from "@/hooks/useFetchHyperboardContents";
import { Center, Flex, IconButton, Spinner, VStack } from "@chakra-ui/react";
import { Hyperboard } from "@/components/hyperboard";
import * as React from "react";
import Head from "next/head";
import { BreadcrumbEntry, Breadcrumbs } from "@/components/breadcrumbs";
import { OwnershipTable } from "@/components/hyperboard/ownership-table";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { useRouter } from "next/router";
import { HyperboardRenderer } from "@/components/hyperboard-renderer";

export const HyperboardRendererWithUi = ({
  hyperboardId,
}: {
  hyperboardId: string;
}) => {
  const { push, query } = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useSize(containerRef);

  const [selectedRegistry, setSelectedRegistry] = useState<string>();

  const { data, isLoading } = useFetchHyperboardContents(hyperboardId);
  const results = data?.results;
  const hyperboard = data?.hyperboard;

  const height = ((dimensions?.width || 1) / 16) * 9;
  const widthPerBoard = `${100 / (results?.length || 1)}%`;

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

  const getWidth = (registryId: string) => {
    if (selectedRegistry === registryId) {
      return "100%";
    }

    if (selectedRegistry && selectedRegistry !== registryId) {
      return "0%";
    }
    return widthPerBoard;
  };

  const crumbs: BreadcrumbEntry[] = [];

  if (hyperboard) {
    crumbs.push({
      name: hyperboard.name,
      onClick: () => setSelectedRegistry(undefined),
    });
  }

  if (selectedRegistry) {
    const registry = hyperboard?.hyperboard_registries.find(
      (x) => x.registries?.id === selectedRegistry,
    );
    if (registry?.registries) {
      crumbs.push({
        name: registry.registries?.name,
        onClick: () => {},
        isActive: true,
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
            selectedRegistry={selectedRegistry}
            onSelectRegistry={setSelectedRegistry}
          />
        )}
      </Center>
    </>
  );
};
