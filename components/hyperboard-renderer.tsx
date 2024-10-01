import { useEffect, useRef, useState } from "react";
import { useSize } from "@chakra-ui/react-use-size";
import { registryContentItemToHyperboardEntry } from "@/hooks/useFetchHyperboardContents";
import { Center, Flex, Spinner } from "@chakra-ui/react";
import { Hyperboard } from "@/components/hyperboard";
import * as React from "react";
import { OwnershipTable } from "@/components/hyperboard/ownership-table";
import { useFetchHyperboardById } from "@/hooks/useFetchHyperboardContents2";

export const HyperboardRenderer = ({
  hyperboardId,
  fullScreen,
  disableToast = false,
  selectedRegistryParent,
  onSelectedRegistryChange,
  showTable = false,
}: {
  hyperboardId: string;
  fullScreen?: boolean;
  disableToast?: boolean;
  selectedRegistryParent?: string;
  onSelectedRegistryChange?: (registryId?: string) => void;
  showTable?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useSize(containerRef);

  const [selectedRegistry, setSelectedRegistry] = useState<string>();

  useEffect(() => {
    if (selectedRegistryParent !== selectedRegistry) {
      setSelectedRegistry(selectedRegistryParent);
    }
  }, [selectedRegistryParent]);

  const { data, isLoading, isLoadingError } =
    useFetchHyperboardById(hyperboardId);

  console.log("data", data);
  if (!data) {
    return null;
  }
  console.log("bla");
  const sections = data.sections.data;

  const height = ((dimensions?.width || 1) / 16) * 9;
  const widthPerBoard = `${100 / (sections?.length || 1)}%`;

  const backgroundImageUrl = data?.background_image;
  const grayscaleImages = !!data?.grayscale_images;
  const borderColor = data?.tile_border_color || undefined;

  const getWidth = (registryId: string) => {
    if (selectedRegistry === registryId) {
      return "100%";
    }

    if (selectedRegistry && selectedRegistry !== registryId) {
      return "0%";
    }
    return widthPerBoard;
  };

  const onSelectedRegistryChangeHandler = (registryId: string) => {
    setSelectedRegistry((currentId) =>
      currentId === registryId ? undefined : registryId,
    );
    if (onSelectedRegistryChange) {
      onSelectedRegistryChange(registryId);
    }
  };

  const backgroundStyle = backgroundImageUrl
    ? {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
      }
    : {
        backgroundColor: "black",
      };

  return (
    <>
      <Flex
        ref={containerRef}
        overflow={"hidden"}
        {...backgroundStyle}
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
        {isLoadingError && (
          <Center
            paddingY={"80px"}
            width={"100%"}
            color="white"
            height={"100%"}
          >
            Could not find hyperboard
          </Center>
        )}
        {isLoading && (
          <Center paddingY={"80px"} width={"100%"} height={"100%"}>
            <Spinner color="white" />
          </Center>
        )}
        {!isLoading && !isLoadingError && sections && (
          <>
            {sections.map((section) => (
              <Flex
                key={section.collection.id}
                width={getWidth(section.collection.id)}
                minWidth={getWidth(section.collection.id)}
                transition={"all 0.5s ease-out"}
                overflow={"hidden"}
              >
                <Hyperboard
                  onClickLabel={() =>
                    onSelectedRegistryChangeHandler(section.collection.id)
                  }
                  label={section.label || "Unlabelled"}
                  height={height}
                  grayscaleImages={grayscaleImages}
                  borderColor={borderColor}
                  data={
                    (Object.values(section.owners) || {}).map((owner) =>
                      registryContentItemToHyperboardEntry(owner),
                    ) || []
                  }
                />
              </Flex>
            ))}
          </>
        )}
      </Flex>
      {showTable && (
        <OwnershipTable
          hyperboardId={hyperboardId}
          showHeader
          selectedRegistry={selectedRegistry}
          onSelectRegistry={setSelectedRegistry}
        />
      )}
    </>
  );
};
