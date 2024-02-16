import { useRef, useState } from "react";
import { useSize } from "@chakra-ui/react-use-size";
import {
  registryContentItemToHyperboardEntry,
  useFetchHyperboardContents,
} from "@/hooks/useFetchHyperboardContents";
import { Center, Flex, Spinner, VStack } from "@chakra-ui/react";
import { Hyperboard } from "@/components/hyperboard";
import * as React from "react";
import Head from "next/head";
import { BreadcrumbEntry, Breadcrumbs } from "@/components/breadcrumbs";
import { OwnershipTable } from "@/components/hyperboard/ownership-table";

export const HyperboardRenderer = ({
  hyperboardId,
  fullScreen,
}: {
  hyperboardId: string;
  fullScreen?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useSize(containerRef);

  const [selectedRegistry, setSelectedRegistry] = useState<string>();

  const { data, isLoading } = useFetchHyperboardContents(hyperboardId);
  const results = data?.results;
  const hyperboard = data?.hyperboard;

  const height = ((dimensions?.width || 1) / 16) * 9;
  const widthPerBoard = `${100 / (results?.length || 1)}%`;

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
      <Flex
        ref={containerRef}
        overflow={"hidden"}
        backgroundColor={"black"}
        aspectRatio={"16 / 9"}
        {...(fullScreen
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 100,
              width: "100vw",
              height: "100vh",
            }
          : {
              width: "100%",
              position: "relative",
            })}
      >
        {isLoading ? (
          <Center paddingY={"80px"} width={"100%"}>
            <Spinner />
          </Center>
        ) : (
          <>
            {results?.map((x) => (
              <Flex
                key={x.registry.id}
                width={getWidth(x.registry.id)}
                minWidth={getWidth(x.registry.id)}
                transition={"all 0.5s ease-out"}
                overflow={"hidden"}
              >
                <Hyperboard
                  onClickLabel={() =>
                    setSelectedRegistry((currentId) =>
                      currentId === x.registry.id ? undefined : x.registry.id,
                    )
                  }
                  label={x.label || "Unlabelled"}
                  height={height}
                  data={
                    (Object.values(x.content) || {})
                      .filter((x) => x.displayData)
                      .map(registryContentItemToHyperboardEntry) || []
                  }
                />
              </Flex>
            ))}
          </>
        )}
      </Flex>
    </>
  );
};
