import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
export interface HyperboardProps {
  data: { id: string; image: string; value: number; name: string }[];
}

type Leaf = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
} & d3.HierarchyNode<{ image: string }>;

export const HyperboardHtml = (props: HyperboardProps) => {
  const ref = useRef<string>("");

  const width = 1600;
  const height = 900;
  const padding = 3;

  const maxWidthRatio = 0.6;
  const maxHeightRatio = 0.6;

  useEffect(() => {
    d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);
  }, []);

  const formattedData = {
    name: "root",
    image: "",
    value: 0,
    children: props.data.map((d) => ({
      name: d.name,
      value: d.value,
      image: d.image,
    })),
  };

  useEffect(() => {
    console.log("drawing", props.data);
    draw();
  }, []);

  const [leaves, setLeaves] = useState<Leaf[]>([]);

  const squares: React.ReactNode[] = [];

  const draw = () => {
    // Append images as patterns
    const svg = d3.select(ref.current);
    const root = d3.hierarchy(formattedData).sum(function (d) {
      return d.value;
    });

    // Give the data to this cluster layout:

    console.log("the new root", root);

    // initialize treemap
    d3
      .treemap()
      .size([width, height])
      // @ts-ignore
      .paddingInner(padding)(root);

    root?.leaves().map((leave) => {
      console.log(leave);
      squares.push(<div>test</div>);
    });

    // Select the nodes
    const nodes = svg.selectAll("rect").data(root.leaves());

    // draw rectangles

    nodes.exit().remove();

    setLeaves(root.leaves() as unknown as Leaf[]);
    console.log("set leaves", leaves);
  };

  console.log(squares);

  return (
    <div
      className="chart"
      style={{
        width: width + padding * 2,
        height: height + padding * 2,
        padding: padding,
        position: "relative",
        // backgroundImage: "url(/bg-1.png)",
      }}
    >
      {leaves.map((leaf, index) => {
        console.log(leaf);
        return (
          <Tile
            key={index}
            logo={leaf.data.image}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            top={leaf.y0}
            left={leaf.x0}
          />
        );
      })}
      {squares}
      {/*
      // @ts-ignore */}
      <svg ref={ref} display={"hidden"}></svg>
    </div>
  );
};

const Tile = ({
  logo,
  width,
  height,
  top,
  left,
}: {
  logo: string;
  width: number;
  height: number;
  top: number;
  left: number;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        top,
        left,
        backgroundColor: "black",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={logo} alt={logo} />
    </div>
  );
};
