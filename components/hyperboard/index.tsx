import * as d3 from "d3";
import { useEffect, useRef } from "react";
export interface HyperboardProps {
  data: { id: string; image: string; value: number; name: string }[];
}

export const Hyperboard = (props: HyperboardProps) => {
  const ref = useRef<SVGElement | null | undefined>();

  const width = 1000;
  const height = 800;

  useEffect(() => {
    d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");
  }, []);

  const formattedData = {
    name: "root",
    value: 0,
    children: props.data.map((d) => ({
      name: d.name,
      value: d.value,
    })),
  };

  useEffect(() => {
    console.log("drawing", props.data);
    draw();
  }, []);

  const draw = () => {
    // Append images as patterns
    const svg = d3.select(ref.current);

    const defs = svg.append("defs");
    for (const item of props.data) {
      defs
        .append("pattern")
        .attr("id", item.id)
        .attr("width", "60%")
        .attr("height", "60%")
        .append("image")
        .attr("width", "60%")
        .attr("height", "60%")
        .attr("xlink:href", item.image)
        .attr("preserveAspectRatio", "xMidYMid slice");
    }

    // Give the data to this cluster layout:
    const root = d3.hierarchy(formattedData).sum(function (d) {
      return d.value;
    });

    // initialize treemap
    d3
      .treemap()
      .size([width, height])
      // @ts-ignore
      .paddingInner(3)(root);

    const color = d3
      .scaleOrdinal()
      .domain(["boss1", "boss2", "boss3"])
      .range(["#402D54", "#D18975", "#8FD175"]);

    const opacity = d3.scaleLinear().domain([10, 30]).range([0.5, 1]);

    // Select the nodes
    const nodes = svg.selectAll("rect").data(root.leaves());

    // draw rectangles
    nodes
      .enter()
      .append("rect")
      .attr("fill", (x) => {
        console.log(x);
        return "url(#a)";
      })
      .attr("x", function (d) {
        // @ts-ignore
        return d.x0;
      })
      .attr("y", function (d) {
        // @ts-ignore
        return d.y0;
      })
      .attr("width", function (d) {
        // @ts-ignore
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        // @ts-ignore
        return d.y1 - d.y0;
      })
      .style("stroke", "black")
      // @ts-ignore
      .style("opacity", function (d) {
        return opacity(d.data.value);
      });

    nodes.exit().remove();

    // select node titles
    const nodeText = svg.selectAll("text").data(root.leaves());

    // add the text
    nodeText
      .enter()
      .append("text")
      .attr("x", function (d) {
        // @ts-ignore
        return d.x0 + 5;
      }) // +10 to adjust position (more right)
      .attr("y", function (d) {
        // @ts-ignore
        return d.y0 + 20;
      }) // +20 to adjust position (lower)
      .text(function (d) {
        return d.data.name.replace("mister_", "");
      })
      .attr("font-size", "19px")
      .attr("fill", "white");

    // select node titles

    // const nodeValues = svg.selectAll("vals").data(root.leaves());

    // add the values
    // nodeValues
    //   .enter()
    //   .append("text")
    //   .attr("x", function (d) {
    //     // @ts-ignore
    //     return d.x0 + 5;
    //   }) // +10 to adjust position (more right)
    //   .attr("y", function (d) {
    //     // @ts-ignore
    //     return d.y0 + 35;
    //   }) // +20 to adjust position (lower)
    //   .text(function (d) {
    //     return d.data.value;
    //   })
    //
    //   .attr("font-size", "11px")
    //   .attr("fill", "white");

    // // add the parent node titles
    // svg
    //   .selectAll("titles")
    //   .data(
    //     root.descendants().filter(function (d) {
    //       return d.depth == 1;
    //     }),
    //   )
    //   .enter()
    //   .append("text")
    //   .attr("x", function (d) {
    //     // @ts-ignore
    //     return d.x0;
    //   })
    //   .attr("y", function (d) {
    //     // @ts-ignore
    //     return d.y0 + 21;
    //   })
    //   .text(function (d) {
    //     return d.data.name;
    //   })
    //   .attr("font-size", "19px")
    //   //@ts-ignore
    //   .attr("fill", function (d) {
    //     return color(d.data.name);
    //   });
  };

  return (
    <div className="chart">
      {/*
      //@ts-ignore */}
      <svg ref={ref}></svg>
    </div>
  );
};
