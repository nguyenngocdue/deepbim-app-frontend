import { FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import ModelCard from "./ModelCard";
import { SectionTitle } from "./SectionTitle";

const projects = [
  {
    title: "Dynamo API - Python",
    imageUrls: [
      "/assets/projects-cv/project_dynamo.png",
      "/assets/projects-cv/project_dynamo_2.png",
    ],
    description: "Build and develop the Dynamo, pyRevit Vietnam community.",
    linkUrl:
      "https://github.com/nguyenngocdue/Library-Dynamo-Python-CSharp/blob/master/README.md",
    tags: ["Python", "WPF", "C#"],
  },
  {
    title: "QAQC Automation Platform",
    imageUrls: [
      "/assets/projects-cv/db_report_1.png",
      "/assets/projects-cv/db_report_2.png",
    ],
    description:
      "Automated QAQC reporting system with dynamic dashboards and SQL data pipelines.",
    linkUrl:
      "https://dbdiagram.io/d/report-v2-27/11/2024-66de7578eef7e08f0e15c02a",
    tags: ["Laravel", "Php", "Blade", "SQL", "Grafana", "EChartsJS"],
  },
  {
    title: "DeepBIM",
    imageUrls: [
      "/assets/viewers/bridge-pier-rebar.png",
      "/assets/viewers/cantilever-bridge-girder.png",
      "/assets/viewers/civil3d-road.png",
      "/assets/viewers/mep-coordination.png",
    ],
    description:
      "A BIM data management platform for organizing, viewing, and analyzing IFC model information in real-time.",
    linkUrl: "https://deepbim.net",
    tags: ["NestJS", "ReactJS", "IFC", "Three.js", "Docker"],
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function ProjectSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Projects"
        icon={<FolderOpen className="w-6 h-6" />}
        description="These are some of the public projects I've worked on, mostly related to data, BIM, and automation. If you're curious about any project or want a deeper look, feel free to reach out via the chat support below!"
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {projects.map((project, index) => (
          <motion.div key={index} variants={itemVariants}>
            <ModelCard {...project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
