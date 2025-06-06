import ModelCard from "./ModelCard";

const projects = [
  {
    title: "Dynamo API - Python",
      imageUrls:[
    "/assets/projects-cv/project_dynamo.png",    
    "/assets/projects-cv/project_dynamo_2.png",
  ],
    description: "Build and develop the Dynamo, pyRevit Vietnam community.",
    linkUrl: "https://github.com/nguyenngocdue/Library-Dynamo-Python-CSharp/blob/master/README.md",
    tags: ["Python", "WPF", "C#"],
  },
  {
    title: "Amazon Microservice",
    imageUrls:[
        "/assets/projects-cv/db_report_1.png",
        "/assets/projects-cv/db_report_2.png",
  ],
    description: "E-commerce backend with Kubernetes, Docker, RabbitMQ.",
    linkUrl: "https://dbdiagram.io/d/report-v2-27/11/2024-66de7578eef7e08f0e15c02a",
    tags: ["NestJS", "Postgres", "Microservice"],
  },
{
  title: "DeepBIM",
  imageUrls: [
    "/assets/viewers/bridge-pier-rebar.png",     
    "/assets/viewers/cantilever-bridge-girder.png", 
    "/assets/viewers/civil3d-road.png", 
    "/assets/viewers/mep-coordination.png", 
  ],
  description: "A BIM data management platform for organizing, viewing, and analyzing IFC model information in real-time.",
  linkUrl: "https://deepbim.net", 
   tags: ["NestJS", "ReactJS","IFC", "Three.js", "Docker"],
}

];

export function ProjectSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-8 text-zinc-800 dark:text-white">
        Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ModelCard
            key={index}
            title={project.title}
            imageUrls={project.imageUrls}
            description={project.description}
            linkUrl={project.linkUrl}
            tags={project.tags}
          />
        ))}
      </div>
    </section>
  );
}
