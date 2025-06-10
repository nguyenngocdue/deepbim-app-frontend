import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Define the type for each node in the graph
interface GraphNode {
  id: string;
  text?: string;
  icon?: string;
  group: "input" | "process" | "output";
  x?: number;
  y?: number;
}

// Define the type for each link in the graph
interface GraphLink {
  source: string;
  target: string;
}

// Define nodes for each level
const nodes: GraphNode[] = [
  { id: "IFC", icon: "/images/ifc.png", group: "input" },
  { id: "GLB", text: "GLB", group: "input" },
  { id: "LAS", text: "LAS", group: "input" },
  { id: "LAZ", text: "LAZ", group: "input" },
  { id: "Revit", icon: "/images/revit.png", group: "input" },
  { id: "Deepbim", icon: "/images/logo_no_bg.png", group: "process" },
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    // Dynamically calculate width and height based on container
    const updateDimensions = () => {
      const containerWidth = containerRef.current?.getBoundingClientRect().width || 300;
      const width = Math.min(containerWidth, 900); // Max width 900px
      const height = width <= 400 ? 400 : 550; // Smaller height on mobile

      // Update SVG dimensions
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      // Clear previous content
      svg.selectAll("*").remove();

      // Define X positions based on group
      const xPositions: Record<string, number> = {
        input: width <= 400 ? 50 : 150,
        process: width / 2,
        output: width <= 400 ? width - 50 : width - 150,
      };

      // Adjust Y positions dynamically
      const nodeSpacing = width <= 400 ? 60 : 90; // Tighter spacing on mobile
      nodes.forEach((node, i) => {
        node.x = xPositions[node.group];
        if (node.group === "process") {
          node.y = height / 2;
        } else if (node.group === "output") {
          node.y = height / 2;
        } else {
          node.y = 80 + i * nodeSpacing; // Adjusted starting Y position
        }
      });

      // Create curved links
      svg
        .selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("stroke", "#bbb")
        .attr("stroke-width", width <= 400 ? 1.5 : 2)
        .attr("fill", "none")
        .attr("d", (d) => {
          const source = nodes.find((n) => n.id === d.source) ?? { x: 0, y: 0 };
          const target = nodes.find((n) => n.id === d.target) ?? { x: width, y: height / 2 };
          const controlOffset = width <= 400 ? 60 : 120;
          return `M${source.x},${source.y} 
                  C${source.x + controlOffset},${source.y} 
                  ${target.x - controlOffset},${target.y} 
                  ${target.x},${target.y}`;
        });

      // Create raycasting effect (pulsing dots)
      const rays = svg
        .selectAll(".ray")
        .data(links)
        .enter()
        .append("circle")
        .attr("class", "ray")
        .attr("r", width <= 400 ? 4 : 5)
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
          .on("end", animateRaycast);
      }

      animateRaycast();

      // Create nodes
      const node = svg
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Node circles with hover effects
      const nodeRadius = width <= 400 ? 20 : 25;
      node
        .append("circle")
        .attr("r", nodeRadius)
        .attr("fill", "white")
        .attr("stroke", "#ccc")
        .attr("stroke-width", width <= 400 ? 1.5 : 2)
        .style("transition", "0.3s")
        .on("mouseover", function () {
          d3.select(this).attr("stroke", "#4CAF50").attr("stroke-width", width <= 400 ? 2 : 3);
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", "#ccc").attr("stroke-width", width <= 400 ? 1.5 : 2);
        });

      // Node images (Icons)
      const iconSize = width <= 400 ? 24 : 30;
      node
        .filter((d) => d.icon)
        .append("image")
        .attr("xlink:href", (d) => d.icon!)
        .attr("x", -iconSize / 2)
        .attr("y", -iconSize / 2)
        .attr("width", iconSize)
        .attr("height", iconSize);

      // Add labels for text-based nodes
      node
        .filter((d) => d.text)
        .append("text")
        .attr("y", 5)
        .attr("text-anchor", "middle")
        .attr("font-size", width <= 400 ? "12px" : "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text((d) => d.text);

      // Add labels under nodes
      node
        .append("text")
        .attr("y", width <= 400 ? 35 : 40)
        .attr("text-anchor", "middle")
        .attr("font-size", width <= 400 ? "10px" : "12px")
        .attr("fill", "#666")
        .text((d) => d.id);
    };

    // Initial render
    updateDimensions();

    // Update on resize
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[900px] mx-auto">
      <svg ref={svgRef} className="w-full h-auto overflow-visible"></svg>
    </div>
  );
};

export default ForceGraph;