import {
  LucideGlobe,
  LucideUsers,
  LucideLaptop,
  LucideSettings2,
  LucideCode,
  LucideServer,
  LucideGitBranch,
  LucideBarChart4,
  LucideTerminalSquare,
  LucideCode2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  Sparkles,
  ChevronDown,
  Share2,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

const overviewGroups = [
  {
    group: "BIM Experience",
    bg: "bg-green-500 dark:bg-[#02c6fc]",
    header: "bg-green-500 dark:bg-[#02c6fc]",
    stripe: "bg-green-500 dark:bg-[#02c6fc]",
    items: [
      { icon: <LucideGlobe className="w-5 h-5" />, title: "Global Projects", desc: "2+ years of BIM experience in Japan and Singapore." },
      { icon: <LucideUsers className="w-5 h-5" />, title: "Major Projects", desc: "Infrastructure, hospitals, schools, bridges." },
      { icon: <LucideLaptop className="w-5 h-5" />, title: "Design Tools", desc: "AutoCAD, Revit, Civil 3D, Navisworks." },
      { icon: <LucideSettings2 className="w-5 h-5" />, title: "Revit Automation", desc: "Dynamo, pyRevit, C#, Python Addins." },
    ],
  },
  {
    group: "Web Development",
    bg: "bg-violet-600 dark:bg-[#00E6AC]",
    header: "bg-violet-600 dark:bg-[#00E6AC]",
    stripe: "bg-violet-600 dark:bg-[#00E6AC]",
    items: [
      { icon: <LucideCode className="w-5 h-5" />, title: "Web Dev", desc: "PHP, JS, Laravel, ReactJS, API." },
      { icon: <LucideServer className="w-5 h-5" />, title: "DevOps Skills", desc: "Docker, K8s, PostgreSQL, MySQL." },
      { icon: <LucideGitBranch className="w-5 h-5" />, title: "Research & Scale", desc: "Microservices, RabbitMQ, distributed arch." },
      { icon: <LucideBarChart4 className="w-5 h-5" />, title: "BIM Viewer Dev", desc: "Three.js, IFC parsers, ThatOpenBIM." },
    ],
  },
  {
    group: "Environment & Soft Skills",
    bg: "bg-[#FF456E] dark:bg-[#EA47A1]",
    header: "bg-[#FF456E] dark:bg-[#EA47A1]",
    stripe: "bg-[#FF456E] dark:bg-[#EA47A1]",
    items: [
      { icon: <LucideTerminalSquare className="w-5 h-5" />, title: "Environment", desc: "Linux, Windows, Git, Bitbucket." },
      { icon: <LucideCode2 className="w-5 h-5" />, title: "Soft Skills", desc: "Teamwork, logic, stakeholder comms." },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};




export function IntroSection() {

  const avatarUrls = [
    "/assets/avatars/avatar_1.png",    
    "/assets/avatars/avatar_2.png",
    "/assets/avatars/avatar_3.png",

  ];

  const [avatarIndex, setAvatarIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
useEffect(() => {
  const interval = setInterval(() => {
    setFadeIn(false);
    setTimeout(() => {
      setAvatarIndex((prev) => (prev + 1) % avatarUrls.length);
      setFadeIn(true);
    }, 250); // Đợi hiệu ứng ẩn xong (300ms)
  }, 5000);

  return () => clearInterval(interval);
}, []);



  return (
    <motion.section
      className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Left Column */}
      <motion.div
        className="flex flex-col items-center md:items-start text-center md:text-left gap-2 col-span-1"
        variants={itemVariants}
      >
        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-32 h-32 ring-4 ring-blue-500 shadow-green-800 shadow-lg dark:ring-green-600 hover:scale-105 transition-transform duration-300 overflow-hidden">
            <AvatarImage
              src={avatarUrls[avatarIndex]}
              alt={`Avatar ${avatarIndex + 1}`}
             className={`object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            />
          </Avatar>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-800 animate-pulse"
            title="Online"
          />
        </div>

        {/* Name & Role */}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Nguyễn Ngọc Duệ <p className="text-sm text-sky-500 dark:text-zinc-400">(Nissan)</p>
        </h1>
        <p className="text-base font-semibold text-blue-600 dark:text-blue-600">
          Fullstack Developer / BIM Engineer
        </p>

        {/* Collapsible: Passion for Coding */}
        <Collapsible className="w-full">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-blue-500 dark:text-sky-400 hover:underline transition group">
            <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
            <span>About my passion for coding</span>
            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 pl-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Coding isn’t just work for me — it’s what I enjoy doing.
            I love turning simple ideas into powerful tools that help people work better.
            Whether it’s improving BIM workflows or building web apps, I’m always learning, improving, and sharing what I know.
          </CollapsibleContent>
        </Collapsible>

        {/* Contact Info */}
        <div className="pl-4 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
          <p className="flex items-center gap-2 group transition-colors hover:text-amber-600 dark:hover:text-amber-400">
            <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110 transition-all" />
            <span className="text-sm">jill.anderson@example.com</span>
          </p>
          <p className="flex items-center gap-2 group transition-colors hover:text-amber-600 dark:hover:text-amber-400">
            <Phone className="w-4 h-4 text-green-500 dark:text-green-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110 transition-all" />
            <span className="text-sm">+84 912 345 678</span>
          </p>
          <p className="flex items-center gap-2 group transition-colors hover:text-amber-600 dark:hover:text-amber-400">
            <MapPin className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110 transition-all" />
            <span className="text-sm">Ho Chi Minh City, Vietnam</span>
          </p>
        </div>



        {/* Collapsible: Social Links */}
        <Collapsible className="mt-2 w-full">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-400 hover:underline transition group">
            <Share2 className="w-4 h-4 group-hover:animate-pulse" />
            <span>Social Links & Portfolio</span>
            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-snug pl-4">
              <p className="flex items-center gap-2 group transition-colors hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                <Linkedin className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <a
                  href="https://www.linkedin.com/in/nguyen-ngoc-due-28a777196/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-2"
                >
                  https://www.linkedin.com/in/nguyen-ngoc-due-28a777196/
                </a>
              </p>
              <p className="flex items-center gap-2 group transition-colors hover:text-green-600 dark:hover:text-green-400 text-sm">
                <Globe className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                <a
                  href="https://jill-portfolio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-2"
                >
                  jill-portfolio.com
                </a>
              </p>
              <p className="flex items-center gap-2 group transition-colors hover:text-zinc-800 dark:hover:text-white text-sm">
                <Github className="w-4 h-4 text-zinc-500 group-hover:scale-110 transition-transform" />
                <a
                  href="https://github.com/jilldev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-2"
                >
                  github.com/jilldev
                </a>
              </p>
            </div>

          </CollapsibleContent>
        </Collapsible>
      </motion.div>



      {/* Right Column */}
      <motion.div className="col-span-2 space-y-6 relative" variants={containerVariants}>
        <div className="absolute left-2 top-0 h-full w-[3px] bg-gradient-to-b from-sky-400 via-violet-400 to-teal-400 z-0 rounded-full" />
        {overviewGroups.map((group, gIdx) => (
          <motion.div
            key={gIdx}
            className="relative z-10 pl-6"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-6 bg-blue-400 z-20 rounded-full" />
            <div className={`flex ${group.bg} rounded-xl shadow-lg overflow-hidden`}>
              <div className={`w-2 ${group.stripe}`} />
              <div className="flex-1">
                <div className={`px-5 py-2 ${group.header}`}>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                    {group.group}
                  </h3>
                </div>
                <div className="p-5">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
                    variants={containerVariants}
                  >
                    {group.items.map((item, iIdx) => (
                      <motion.div
                        key={iIdx}
                        className="flex items-start gap-3 bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300"
                        variants={itemVariants}
                        whileHover={{ scale: 1.04 }}
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600">
                          <div className="w-5 h-5  dark:text-blue-400 text-blue-600">{item.icon}</div>
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm">
                            {item.title}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
