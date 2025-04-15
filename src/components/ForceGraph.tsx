import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// ✅ Define the type for each node in the graph
interface GraphNode {
  id: string;
  text?: string;
  icon?: string;
  group: "input" | "process" | "output";
  x?: number;
  y?: number;
}

// ✅ Define the type for each link in the graph
interface GraphLink {
  source: string;
  target: string;
}

// Define nodes for each level
const nodes: GraphNode[] = [
  { id: "IFC", icon: "/extensions/ifc.png", group: "input" },
  { id: "GLB", text: "GLB", group: "input" },
  { id: "LAS", text: "LAS", group: "input" },
  { id: "LAZ", text: "LAZ", group: "input" },
  { id: "Revit", icon: "/extensions/revit.png", group: "input" },
  { id: "Deepbim", icon: "/images/logo.png", group: "process" }, // Main processing node
  { id: "User", icon: "/icons/user.svg", group: "output" },
];

// Define links between nodes
const links: GraphLink[] = [
  { source: "IFC", target: "Deepbim" },
  { source: "GLB", target: "Deepbim" },
  { source: "LAS", target: "Deepbim" },
  { source: "LAZ", target: "Deepbim" },
  { source: "Revit", target: "Deepbim" },
  { source: "Deepbim", target: "User" },
];

const ForceGraph = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 900;
    const height = 550;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // ✅ Define X positions based on group
    const xPositions: Record<string, number> = {
      input: 150,
      process: width / 2,
      output: width - 150,
    };

    // ✅ Assign Y positions dynamically
    nodes.forEach((node, i) => {
      node.x = xPositions[node.group];
      if (node.group === "process") {
        node.y = height / 2;
      } else if (node.group === "output") {
        node.y = height / 2;
      } else {
        node.y = 100 + i * 90; // Ensure correct spacing
      }
    });

    // ✅ Create curved links
    svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", "#bbb")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("d", (d) => {
        const source = nodes.find((n) => n.id === d.source) ?? { x: 0, y: 0 };
        const target = nodes.find((n) => n.id === d.target) ?? { x: width, y: height / 2 };

        return `M${source.x},${source.y} 
                C${source.x + 120},${source.y} 
                ${target.x - 120},${target.y} 
                ${target.x},${target.y}`;
      });

    // ✅ Create raycasting effect (pulsing dots)
    const rays = svg
      .selectAll(".ray")
      .data(links)
      .enter()
      .append("circle")
      .attr("class", "ray")
      .attr("r", 5)
      .attr("fill", "green");

    function animateRaycast() {
      rays
        .attr("cx", (d) => {
          const source = nodes.find((n) => n.id === d.source) ?? { x: 0 };
          return source.x!;
        })
        .attr("cy", (d) => {
          const source = nodes.find((n) => n.id === d.source) ?? { y: 0 };
          return source.y!;
        })
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("cx", (d) => {
          const target = nodes.find((n) => n.id === d.target) ?? { x: width };
          return target.x!;
        })
        .attr("cy", (d) => {
          const target = nodes.find((n) => n.id === d.target) ?? { y: height / 2 };
          return target.y!;
        })
        .on("end", animateRaycast); // Repeat animation
    }

    animateRaycast(); // Start raycasting animation

    // ✅ Create nodes
    const node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // ✅ Node circles with hover effects
    node
      .append("circle")
      .attr("r", 25)
      .attr("fill", "white")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .style("transition", "0.3s")
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#4CAF50").attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "#ccc").attr("stroke-width", 2);
      });

    // ✅ Node images (Icons)
    node
      .filter((d) => d.icon)
      .append("image")
      .attr("xlink:href", (d) => d.icon!)
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 30)
      .attr("height", 30);

    // ✅ Add labels for text-based nodes
    node
      .filter((d) => d.text)
      .append("text")
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text((d) => d.text);

    // ✅ Add labels under nodes
    node
      .append("text")
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text((d) => d.id);
  }, []);

  return <svg ref={svgRef} className="overflow-visible"></svg>;
};

export default ForceGraph;
