import { useRef, useState } from "react";
import { useSize } from "@chakra-ui/react-use-size";
import {
  registryContentItemToHyperboardEntry,
  useHyperboardContents,
} from "@/hooks/registry";
import { Center, Flex, Spinner } from "@chakra-ui/react";
import { Hyperboard } from "@/components/hyperboard";
import * as React from "react";
import Head from "next/head";

export const FtcBoard = ({ hyperboardId }: { hyperboardId: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useSize(containerRef);

  const [selectedRegistry, setSelectedRegistry] = useState<string>();

  const { data, isLoading } = useHyperboardContents(hyperboardId);
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

  return (
    <>
      <Head>
        <title>Hyperboards - {hyperboard?.name || "Loading"}</title>
      </Head>
      <Center width={"100%"} paddingX={"80px"}>
        <Flex
          width={"100%"}
          ref={containerRef}
          overflow={"hidden"}
          backgroundColor={"black"}
          aspectRatio={"16 / 9"}
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
                        .map((x) => registryContentItemToHyperboardEntry(x)) ||
                      []
                    }
                  />
                </Flex>
              ))}
            </>
          )}
        </Flex>
      </Center>
    </>
  );
};
