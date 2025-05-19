import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Link2, Mail, Linkedin } from "lucide-react";

export default function PortfolioShowcase() {
  const user = {
    name: "Jamed Allan",
    role: "Frontend Developer",
    avatar: "/avatars/01.png",
    location: "Ho Chi Minh City, Vietnam",
    email: "jamesallan@email.com",
    linkedin: "jamesallan",
    github: "jamesallan",
    about:
      "Hi! I'm Jamed, a passionate developer specializing in building beautiful and performant user interfaces. I love turning complex problems into simple, elegant solutions.",
    skills: [
      "ReactJS",
      "Next.js",
      "TypeScript",
      "TailwindCSS",
      "UI/UX",
      "Node.js",
      "Framer Motion",
      "Figma",
    ],
    projects: [
      {
        name: "Portfolio Website",
        desc: "Personal portfolio site showcasing my work and skills. Built with Next.js, tailwindcss and shadcn/ui.",
        tech: ["Next.js", "TailwindCSS", "shadcn/ui"],
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
        url: "https://jamesallan.dev",
        github: "https://github.com/jamesallan/portfolio",
      },
      {
        name: "TaskFlow App",
        desc: "Kanban board app for task management with drag-and-drop and real-time updates.",
        tech: ["ReactJS", "Redux", "Socket.io", "Node.js"],
        img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
        url: "https://taskflowapp.vercel.app",
        github: "https://github.com/jamesallan/taskflow",
      },
      {
        name: "Blog Platform",
        desc: "Multi-user blogging platform with markdown support, comments, and full text search.",
        tech: ["Next.js", "Prisma", "PostgreSQL", "TailwindCSS"],
        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600",
        url: "#",
        github: "https://github.com/jamesallan/blog-platform",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-zinc-100 flex flex-col items-center py-12 px-4">
      {/* Top card: Profile summary */}
      <Card className="w-full max-w-4xl rounded-3xl shadow-2xl border-0 bg-white overflow-hidden mb-10">
        <CardContent className="flex flex-col md:flex-row gap-8 p-10 items-center">
          {/* Avatar and Info */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3 gap-3">
            <Avatar className="w-28 h-28 border-4 border-white shadow mb-2">
              <AvatarImage src={user.avatar} alt="Avatar" />
              <AvatarFallback className="text-3xl">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-2xl font-bold text-zinc-900">{user.name}</div>
            <div className="text-lg text-zinc-500">{user.role}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <a href={`mailto:${user.email}`} className="text-blue-700 hover:underline flex items-center">
                <Mail className="w-5 h-5 mr-1" /> Email
              </a>
              <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer"
                className="text-blue-700 hover:underline flex items-center">
                <Linkedin className="w-5 h-5 mr-1" /> LinkedIn
              </a>
              <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer"
                className="text-gray-800 hover:underline flex items-center">
                <Github className="w-5 h-5 mr-1" /> GitHub
              </a>
            </div>
          </div>
          {/* About and skills */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="text-lg text-zinc-700">{user.about}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills.map(skill => (
                <Badge key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-base">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Projects */}
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center tracking-tight">Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {user.projects.map((proj) => (
            <Card
              key={proj.name}
              className="rounded-2xl shadow-xl border-0 bg-white hover:scale-[1.02] transition-transform"
            >
              <img
                src={proj.img}
                alt={proj.name}
                className="w-full h-44 object-cover rounded-t-2xl"
                loading="lazy"
              />
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-blue-800">{proj.name}</span>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-blue-700">
                      <Link2 className="w-5 h-5 inline" />
                    </a>
                  )}
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-800">
                      <Github className="w-5 h-5 inline" />
                    </a>
                  )}
                </div>
                <div className="text-base text-zinc-700 mb-3">{proj.desc}</div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {proj.tech.map(t => (
                    <Badge key={t} className="bg-zinc-200 text-zinc-800 px-2 py-1 rounded-md text-sm">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
