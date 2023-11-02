import { useEffect, useRef, useState } from "react";
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

  const [displayBoards, setDisplayBoards] = useState<
    "sponsors" | "speakers" | "all"
  >("all");

  const { data: results, isLoading } = useHyperboardContents(hyperboardId);

  const data = results?.content || {};

  const sponsors = Object.values(data).filter(
    (x) =>
      x.displayData?.type === "person" || x.displayData?.type === "company",
  );
  const speakers = Object.values(data || {}).filter(
    (x) => x.displayData?.type === "speaker",
  );

  const height = ((dimensions?.width || 1) / 16) * 9;

  const [speakerWidth, setSpeakerWidth] = useState("50%");
  const [sponsorWidth, setSponsorWidth] = useState("50%");

  useEffect(() => {
    if (displayBoards === "all") {
      setSpeakerWidth("50%");
      setSponsorWidth("50%");
    }

    if (displayBoards === "sponsors") {
      setSpeakerWidth("0%");
      setSponsorWidth("100%");
    }

    if (displayBoards === "speakers") {
      setSpeakerWidth("100%");
      setSponsorWidth("0%");
    }
  }, [displayBoards]);

  return (
    <>
      <Head>
        <title>Hyperboards - {results?.hyperboard?.name || "Loading"}</title>
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
              <Flex
                width={sponsorWidth}
                minWidth={sponsorWidth}
                transition={"all 0.5s ease-out"}
                overflow={"hidden"}
              >
                <Hyperboard
                  onClickLabel={() =>
                    setDisplayBoards((val) =>
                      val === "all" ? "sponsors" : "all",
                    )
                  }
                  label="Sponsors"
                  height={height}
                  data={sponsors.map((x) =>
                    registryContentItemToHyperboardEntry(x),
                  )}
                />
              </Flex>
              <Flex
                width={speakerWidth}
                minWidth={speakerWidth}
                transition={"all 0.5s ease-out"}
                overflow={"hidden"}
              >
                <Hyperboard
                  onClickLabel={() =>
                    setDisplayBoards((val) =>
                      val === "all" ? "speakers" : "all",
                    )
                  }
                  label="Speakers"
                  height={height}
                  data={speakers.map((x) =>
                    registryContentItemToHyperboardEntry(x),
                  )}
                />
              </Flex>
            </>
          )}
        </Flex>
      </Center>
    </>
  );
};
