import { useEffect, useRef } from "react";
import * as d3 from "d3";

const skills = [
  { id: "frontend", label: "Frontend", icon: "🖥️" },
  { id: "backend", label: "Backend", icon: "🔧" },
  { id: "devops", label: "DevOps", icon: "⚙️" },
  { id: "db", label: "Database", icon: "🗄️" },
  { id: "viz", label: "Visualization", icon: "📊" },
  { id: "html", label: "HTML", parent: "frontend" },
  { id: "css", label: "CSS", parent: "frontend" },
  { id: "js", label: "JavaScript", parent: "frontend" },
  { id: "react", label: "ReactJS", parent: "frontend" },
  { id: "php", label: "PHP", parent: "backend" },
  { id: "laravel", label: "Laravel", parent: "backend" },
  { id: "python", label: "Python", parent: "backend" },
  { id: "csharp", label: "C#", parent: "backend" },
  { id: "docker", label: "Docker", parent: "devops" },
  { id: "k8s", label: "K8s", parent: "devops" },
  { id: "postgres", label: "PostgreSQL", parent: "db" },
  { id: "mysql", label: "MySQL", parent: "db" },
  { id: "threejs", label: "Three.js", parent: "viz" }
];

const links = skills
  .filter((s) => s.parent)
  .map((s) => ({ source: s.parent, target: s.id }));

export function SkillSection() {
  return (
    <section className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Skill Visual Map</h2>
      <SkillGraph nodes={skills} links={links} />
    </section>
  );
}

function SkillGraph({ nodes, links }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 450;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(90))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", (d) => (d.parent ? "#fca5a5" : "#1d4ed8"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(
        d3.drag()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .text((d) => d.icon || d.label)
      .attr("fill", (d) => (d.parent ? "#1f2937" : "#fef9c3"));

    sim.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      label
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });
  }, [nodes, links]);

  return <svg ref={ref} className="w-full h-[500px]" />;
}
