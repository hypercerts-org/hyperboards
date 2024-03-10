import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { HyperboardEntry } from "@/types/Hyperboard";
import { Tile } from "@/components/hyperboard/Tile";
import { useSize } from "@chakra-ui/react-use-size";
import { Flex, Text } from "@chakra-ui/react";
import _ from "lodash";

export interface HyperboardProps {
  data: HyperboardEntry[];
  height: number;
  label: string;
  onClickLabel: () => void;
  grayscaleImages?: boolean;
  borderColor?: string;
}

type Leaf = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
} & d3.HierarchyNode<HyperboardEntry>;

export const Hyperboard = (props: HyperboardProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<string>("");
  const dimensions = useSize(containerRef);

  const [leaves, setLeaves] = useState<Leaf[]>([]);

  const padding = 0;

  const formattedData = {
    name: "root",
    image: "",
    value: 0,
    children: _.sortBy(props.data, (x) => -x.value).map((d) => ({
      ...d,
    })),
  };

  const { height, width } = dimensions || {};
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    if (!dimensions) {
      return;
    }
    // console.log("drawing", containerRef.current, dimensions);
    d3.select(ref.current)
      .attr("width", props.height)
      .attr("height", props.height)
      .attr("viewBox", `0 0 ${props.height} ${props.height}`);
    draw();
  }, [containerRef.current, width, height]);

  const draw = () => {
    if (!dimensions) {
      return;
    }
    // Append images as patterns
    const svg = d3.select(ref.current);
    const root = d3.hierarchy(formattedData).sum(function (d) {
      return Number(d.value);
    });

    // Give the data to this cluster layout:

    // initialize treemap
    d3
      .treemap()
      .tile(d3.treemapSquarify.ratio(1 / 3))
      .size([dimensions.height, dimensions.height])
      // @ts-ignore
      .paddingInner(padding)(root);

    // Select the nodes
    const nodes = svg.selectAll("rect").data(root.leaves());

    // draw rectangles

    nodes.exit().remove();

    setLeaves(root.leaves() as unknown as Leaf[]);
  };

  const ratio =
    dimensions?.width && dimensions?.height
      ? dimensions.width / dimensions.height
      : 1;

  return (
    <Flex
      width={"100%"}
      padding={"0px"}
      flexDirection={"column"}
      overflow={"hidden"}
      maxHeight={props.height}
      minH={props.height}
    >
      <Flex
        paddingY={1}
        pl={1}
        onClick={() => props.onClickLabel()}
        cursor={"pointer"}
        textTransform={"uppercase"}
        color={"white"}
        fontFamily={"Director-Variable"}
        backgroundColor={"black"}
      >
        <Text>{props.label}</Text>
        <Text ml={6}>{props.data.length}</Text>
      </Flex>
      <div
        ref={containerRef}
        className="chart"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {leaves.map((leaf, index) => {
          const width = leaf.x1 - leaf.x0;
          return (
            <Tile
              padding={2}
              key={index}
              entry={leaf.data}
              width={width * ratio}
              height={leaf.y1 - leaf.y0}
              top={leaf.y0}
              left={leaf.x0 * ratio}
              grayScale={props.grayscaleImages}
              borderColor={props.borderColor}
            />
          );
        })}
        <svg ref={ref as unknown as string} display={"hidden"}></svg>
      </div>
    </Flex>
  );
};
