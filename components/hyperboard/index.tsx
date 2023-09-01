import * as d3 from "d3";
import { useEffect, useRef } from "react";
export interface HyperboardProps {
  data: { id: string; image: string; value: number; name: string }[];
}

export const Hyperboard = (props: HyperboardProps) => {
  const ref = useRef<SVGElement | null | undefined>();

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
    resizeLogos();
    alignLogos();
  }, []);

  const resizeLogos = () => {
    window.document.querySelectorAll(".company-logo").forEach((logo: any) => {
      const parentHeight = parseFloat(
        logo.parentElement?.getBoundingClientRect().height,
      );

      const parentWidth = parseFloat(
        logo.parentElement?.getBoundingClientRect().width,
      );

      const maxHeight = parentHeight * maxHeightRatio;
      const maxWidth = parentWidth * maxWidthRatio;

      console.log("parentHeight", parentHeight);
      console.log("maxHeight", maxHeight);

      logo.setAttribute("height", maxHeight);
      logo.setAttribute("width", maxWidth);

      // logo.setAttribute("x", (x - width / 2).toString());
      // logo.setAttribute("y", (y - height / 2).toString());

      // logo.setAttribute(
      //   "transform",
      //   `translate(-${width / 2}, -${height / 2})`,
      // );
    });
  };

  const alignLogos = () => {
    window.document.querySelectorAll(".company-logo").forEach((logo: any) => {
      const width = logo.getBoundingClientRect().width;
      const height = logo.getBoundingClientRect().height;

      const parentX = logo.parentElement.getAttribute("x");
      const parentWidth = logo.parentElement.getAttribute("width");

      const newX = parseFloat(parentX) + parseFloat(parentWidth) / 2;
      logo.setAttribute("x", newX);

      const parentY = logo.parentElement.getAttribute("y");
      const parentHeight = logo.parentElement.getAttribute("height");

      const newY = parseFloat(parentY) + parseFloat(parentHeight) / 2;
      logo.setAttribute("y", newY);

      logo.setAttribute(
        "transform",
        `translate(-${width / 2}, -${height / 2})`,
      );
    });
  };

  const draw = () => {
    // Append images as patterns
    const svg = d3.select(ref.current);

    // Give the data to this cluster layout:
    const root = d3.hierarchy(formattedData).sum(function (d) {
      return d.value;
    });

    // initialize treemap
    d3
      .treemap()
      .size([width, height])
      // @ts-ignore
      .paddingInner(padding)(root);

    // Select the nodes
    const nodes = svg.selectAll("rect").data(root.leaves());

    // draw rectangles
    const gs = nodes
      .enter()
      .append("g")
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
      });
    gs.append("rect")
      // .attr("fill", "url(#a)")
      .attr("fill", "black")
      .attr("opacity", "1")
      .attr("rx", 10)
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
      });

    gs.append("image")
      .attr("class", "company-logo")
      .attr("xlink:href", function (d) {
        return d.data.image;
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
        const width = d.x1 - d.x0;
        return width * maxWidthRatio;
      })
      .attr("max-height", function (d) {
        // @ts-ignore
        const height = d.y1 - d.y0;
        return height * maxHeightRatio;
      })
      // .attr("height", "100%")
      // .attr("transform", "translate(-100, -100)")
      .attr("preserveAspectRatio", "xMidYMid meet");

    nodes.exit().remove();

    // draw rectangles
    // nodes
    //   .enter()
    //   .append("image")
    //   .attr("xlink:href", function (d) {
    //     return d.data.image;
    //   })
    //   .attr("x", 2)
    //   .attr("width", "100px")
    //   .attr("height", "100px")
    //   .attr("preserveAspectRatio", "xMidYMid slice");

    // select node titles
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
    <div
      className="chart"
      style={{
        width: width + padding * 2,
        height: height + padding * 2,
        padding: padding,
        backgroundImage: "url(/bg-1.png)",
      }}
    >
      {/*
      //@ts-ignore */}
      <svg ref={ref}></svg>
    </div>
  );
};
