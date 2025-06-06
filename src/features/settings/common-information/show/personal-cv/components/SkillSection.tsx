import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { SectionTitle } from "./SectionTitle";

const skills = [
  { id: "frontend", label: "Frontend", icon: "🖥️" },
  { id: "backend", label: "Backend", icon: "🛠️" },
  { id: "framework", label: "Framework", icon: "📦" },
  { id: "devops", label: "DevOps", icon: "⚙️" },
  { id: "db", label: "Database", icon: "💾" },
  { id: "bim", label: "3D / BIM", icon: "🏗️" },

  // Frontend
  { id: "typescript", label: "TypeScript", parent: "frontend", icon: "📘" },
  { id: "js", label: "JavaScript", parent: "frontend", icon: "🟨" },
  { id: "react", label: "ReactJS", parent: "frontend", icon: "⚛️" },
  { id: "vite", label: "Vite", parent: "frontend", icon: "⚡" },
  { id: "blade", label: "Blade", parent: "frontend", icon: "🧩" },

  // Backend
  { id: "php", label: "PHP", parent: "backend", icon: "🐘" },
  { id: "python", label: "Python", parent: "backend", icon: "🐍" },
  { id: "nestjs", label: "NestJS", parent: "backend", icon: "🎯" },

  // Framework
  { id: "laravel", label: "Laravel", parent: "framework", icon: "🌐" },
  { id: "node", label: "Node.js", parent: "framework", icon: "🟩" },

  // DevOps
  { id: "docker", label: "Docker", parent: "devops", icon: "🐳" },
  { id: "k8s", label: "K8s (50%)", parent: "devops", icon: "☸️" },
  { id: "cicd", label: "CI/CD", parent: "devops", icon: "🔁" },
  { id: "nginx", label: "Nginx", parent: "devops", icon: "🧭" },

  // Database
  { id: "postgres", label: "PostgreSQL", parent: "db", icon: "🐘" },
  { id: "mysql", label: "MySQL", parent: "db", icon: "🦠" },

  // 3D / BIM
  { id: "ifc", label: "IFC", parent: "bim", icon: "📐" },
  { id: "ifcopenshell", label: "IfcOpenShell", parent: "bim", icon: "📂" },
  { id: "xeokit", label: "xeokit", parent: "bim", icon: "🧊" },
  { id: "thatopenbim", label: "thatOpenBIM", parent: "bim", icon: "🔓" },
  { id: "threejs", label: "Three.js", parent: "bim", icon: "🌐" },
];

const links = skills
  .filter((s) => s.parent)
  .map((s) => ({ source: s.parent, target: s.id }));

export function SkillSection() {
  const [showLabels, setShowLabels] = useState(true);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <SectionTitle
        title="🧠 Skill Visual Map"
        description="Explore grouped development skills in frontend, backend, DevOps, frameworks, databases, and 3D/BIM."
      />

      <div className="flex items-center mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={() => setShowLabels(!showLabels)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-slate-700">Show Labels</span>
        </label>
      </div>

      <div className="bg-background">
        <SkillGraph nodes={skills} links={links} showLabels={showLabels} />
      </div>
    </section>
  );
}

function SkillGraph({ nodes, links, showLabels }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 600;
    const padding = 10;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    svg.append("defs")
      .append("pattern")
      .attr("id", "grid3d")
      .attr("width", 40)
      .attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M0 40 L40 0 M40 40 L0 0")
       .attr("stroke", "var(--grid-stroke)")
      .attr("stroke-width", 1)           // từ 0.5 ➝ 1
      .attr("stroke-opacity", 0.1)       // từ 0.4 ➝ 0.8

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#grid3d)");





    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(110))
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(35));


    sim
      .force("x", d3.forceX((d) => {
        switch (d.parent || d.id) {
          case "frontend": return width * 0.2;
          case "backend": return width * 0.8;
          case "framework": return width * 0.5;
          case "devops": return width * 0.2;
          case "db": return width * 0.5;
          case "bim": return width * 0.8;
          default: return width / 2;
        }
      }).strength(0.15))
      .force("y", d3.forceY((d) => {
        switch (d.parent || d.id) {
          case "frontend":
          case "backend":
          case "framework":
            return height * 0.3; // top
          case "devops":
          case "db":
          case "bim":
            return height * 0.75; // bottom
          default:
            return height / 2;
        }
      }).strength(0.15));



    const link = svg.append("g")
      .attr("stroke", "var(--link-color)") 
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 22)
      .attr("fill", (d) => (d.parent ? "#60a5fa" : "#2563eb"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .call(
        d3.drag()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = Math.max(padding, Math.min(width - padding, event.x));
            d.fy = Math.max(padding, Math.min(height - padding, event.y));
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const iconText = svg.append("g")
      .selectAll("text.icon")
      .data(nodes)
      .join("text")
      .attr("class", "icon")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-family", "sans-serif")
      .text((d) => d.icon)
      .attr("pointer-events", "none")
      .attr("fill", "#fff"); // icon nằm trong node

    const label = svg.append("g")
      .selectAll("text.label")
      .data(nodes)
      .join("text")
      .attr("class", "label")
      .attr("dy", -30)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .text((d) => d.label)
     .attr("fill", "var(--label-color)")
      .style("opacity", showLabels ? 1 : 0);


    sim.on("tick", () => {
      nodes.forEach((d) => {
        d.x = Math.max(padding, Math.min(width - padding, d.x));
        d.y = Math.max(padding, Math.min(height - padding, d.y));
      });

      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      iconText
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);

      label
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);

    });
  }, [nodes, links, showLabels]);

  return (
    <svg ref={ref} className="w-full h-[500px] bg-background" />
  );
}
