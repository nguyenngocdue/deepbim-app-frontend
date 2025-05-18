import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

export default function PersonalCV() {
  const profile = {
    name: "Jamed Allan",
    job: "Frontend Developer",
    avatar: "/avatars/01.png",
    location: "Ho Chi Minh City, Vietnam",
    phone: "+84 123 456 789",
    email: "jamesallan@email.com",
    linkedin: "jamesallan",
    github: "jamesallan",
    summary:
      "Creative and detail-oriented Frontend Developer with 4+ years of experience building modern, responsive web applications. Passionate about UI/UX, clean code, and teamwork.",
    skills: [
      "ReactJS",
      "TypeScript",
      "TailwindCSS",
      "Redux",
      "Next.js",
      "REST API",
      "UI/UX",
      "Figma",
      "Unit Testing",
    ],
    experiences: [
      {
        position: "Frontend Developer",
        company: "VietTech Solutions",
        time: "2022 - Present",
        desc: [
          "Build and maintain scalable SPA with ReactJS, Next.js.",
          "Work closely with designers to deliver high-quality UI/UX.",
          "Optimize performance and cross-browser compatibility.",
        ],
      },
      {
        position: "Web Developer",
        company: "Global Soft",
        time: "2020 - 2022",
        desc: [
          "Developed internal management dashboards for clients.",
          "Integrated REST APIs, authentication, and real-time updates.",
          "Mentored new team members in React and TypeScript.",
        ],
      },
    ],
    education: [
      {
        degree: "BSc. Information Technology",
        school: "HCMC University of Technology",
        time: "2016 - 2020",
      },
    ],
    certificates: [
      {
        name: "ReactJS Professional Certificate",
        by: "Coursera",
        year: "2021",
      },
      {
        name: "IELTS 7.0",
        by: "British Council",
        year: "2019",
      },
    ],
    projects: [
      {
        name: "Portfolio Website",
        url: "https://jamesallan.dev",
        desc: "Personal website built with Next.js, tailwindcss and shadcn/ui.",
      },
      {
        name: "TaskFlow App",
        url: "#",
        desc: "A Trello-like Kanban board for managing team workflow.",
      },
    ],
    interests: ["UI Animation", "Coding Meetup", "Photography", "Travel"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-zinc-100 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-4xl rounded-3xl shadow-2xl border-0 bg-white overflow-hidden">
        <CardContent className="flex flex-col md:flex-row gap-8 p-10">
          {/* Left Panel - Avatar and contacts */}
          <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
            <Avatar className="w-36 h-36 border-4 border-white shadow mb-2">
              <AvatarImage src={profile.avatar} alt="Avatar" />
              <AvatarFallback className="text-4xl">{profile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="text-2xl font-bold text-zinc-900 text-center">
              {profile.name}
            </div>
            <div className="text-lg text-zinc-500 text-center">{profile.job}</div>
            <div className="flex flex-col gap-2 mt-4 text-zinc-700 text-base w-full">
              <ContactLine icon={<Mail size={18} className="mr-2" />} text={profile.email} />
              <ContactLine icon={<Phone size={18} className="mr-2" />} text={profile.phone} />
              <ContactLine icon={<MapPin size={18} className="mr-2" />} text={profile.location} />
              <a
                href={`https://linkedin.com/in/${profile.linkedin}`}
                className="flex items-center hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} className="mr-2 text-blue-700" />
                linkedin.com/in/{profile.linkedin}
              </a>
              <a
                href={`https://github.com/${profile.github}`}
                className="flex items-center hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} className="mr-2" />
                github.com/{profile.github}
              </a>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {profile.skills.map((skill) => (
                <Badge key={skill} className="rounded-xl px-3 py-1 text-base bg-blue-100 text-blue-800">
                  {skill}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full mt-8 border-2 border-blue-200 text-blue-800 font-semibold text-lg"
              onClick={() => window.print()}
            >
              Download PDF
            </Button>
          </div>

          {/* Right Panel - Main info */}
          <div className="w-full md:w-2/3 flex flex-col gap-8">
            {/* Summary */}
            <Section title="Profile">
              <div className="text-lg text-zinc-800">{profile.summary}</div>
            </Section>

            {/* Experience */}
            <Section title="Experience">
              <div className="flex flex-col gap-6">
                {profile.experiences.map((exp) => (
                  <div key={exp.company}>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold text-blue-900">{exp.position}</div>
                      <div className="text-base text-zinc-400 font-medium">{exp.company}</div>
                      <span className="ml-auto text-base text-blue-700">{exp.time}</span>
                    </div>
                    <ul className="list-disc ml-6 text-base text-zinc-700 mt-1">
                      {exp.desc.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* Education */}
            <Section title="Education">
              <div className="flex flex-col gap-2">
                {profile.education.map((edu) => (
                  <div key={edu.degree}>
                    <div className="text-base font-semibold text-blue-900">{edu.degree}</div>
                    <div className="text-base text-zinc-600">{edu.school}</div>
                    <div className="text-sm text-zinc-400">{edu.time}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Certificates */}
            <Section title="Certificates">
              <div className="flex flex-wrap gap-4">
                {profile.certificates.map((cert) => (
                  <div key={cert.name} className="bg-blue-50 rounded-lg px-4 py-2 text-base">
                    <span className="font-semibold">{cert.name}</span>{" "}
                    <span className="text-zinc-500">({cert.by}, {cert.year})</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Projects */}
            <Section title="Projects">
              <div className="flex flex-col gap-3">
                {profile.projects.map((proj) => (
                  <div key={proj.name}>
                    <a
                      href={proj.url}
                      className="font-semibold text-blue-700 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {proj.name}
                    </a>
                    <span className="ml-2 text-zinc-500">{proj.desc}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Interests */}
            <Section title="Interests">
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <Badge key={i} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-xl text-base">{i}</Badge>
                ))}
              </div>
            </Section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Contact line with icon
function ContactLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center">
      {icon}
      <span className="truncate">{text}</span>
    </div>
  );
}

// Section title and content
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xl font-bold mb-2 text-blue-900">{title}</div>
      {children}
    </div>
  );
}
