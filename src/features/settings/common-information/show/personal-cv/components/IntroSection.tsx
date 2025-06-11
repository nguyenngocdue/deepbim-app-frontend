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
import { Separator } from "@radix-ui/react-separator";
import { useTranslation } from "react-i18next";
import { CgProfile } from "react-icons/cg";
import PDFViewer from "@/features/cloud/components/pdf-viewer/PDFViewer";
import { PDFDialogViewer } from "@/features/cloud/components/pdf-viewer/PDFDialogViewer";

const overviewGroups = [
  {
    group: "BIM Experience",
    bg: "bg-green-500 dark:bg-[#02c6fc]",
    header: "bg-green-500 dark:bg-[#02c6fc]",
    stripe: "bg-green-500 dark:bg-[#02c6fc]",
    items: [
      { icon: <LucideGlobe className="w-5 h-5" />, title: "Global Projects", desc: "2+ years of BIM experience in Japan and Singapore." },
      { icon: <LucideUsers className="w-5 h-5" />, title: "Major Projects", desc: "Infrastructure, hospitals, schools, bridges." },
      { icon: <LucideLaptop className="w-5 h-5" />, title: "Design Tools", desc: "AutoCAD, Revit, Civil 3D, Navisworks" },
      { icon: <LucideSettings2 className="w-5 h-5" />, title: "Revit Automation", desc: "Dynamo, pyRevit, C#, Python Addins." },
    ],
  },
  {
    group: "Web Development",
    bg: "bg-violet-600 dark:bg-[#00E6AC]",
    header: "bg-violet-600 dark:bg-[#00E6AC]",
    stripe: "bg-violet-600 dark:bg-[#00E6AC]",
    items: [
      { icon: <LucideCode className="w-5 h-5" />, title: "Frontend & Backend", desc: "ReactJS, PHP, Laravel, JavaScript, RESTful API." },
      { icon: <LucideServer className="w-5 h-5" />, title: "DevOps", desc: "Docker, basic Kubernetes (K8s), CI/CD pipelines" },
      { icon: <LucideGitBranch className="w-5 h-5" />, title: "System Architecture", desc: "Microservices, RabbitMQ, distributed design." },
      { icon: <LucideBarChart4 className="w-5 h-5" />, title: "BIM Viewer Development", desc: "Three.js, IFC parsers, ThatOpenBIM, IfcOpenShell" },
    ],
  },
  {
    group: "Environments & Supporting Skills",
    bg: "bg-[#FF456E] dark:bg-[#EA47A1]",
    header: "bg-[#FF456E] dark:bg-[#EA47A1]",
    stripe: "bg-[#FF456E] dark:bg-[#EA47A1]",
    items: [
      { icon: <LucideTerminalSquare className="w-5 h-5" />, title: "Working Environment", desc: "Linux, Windows, Git, Bitbucket, Nginx." },
      {
        icon: <LucideServer className="w-5 h-5" />,
        title: "Databases",
        desc: "PostgreSQL, MySQL. Proficient in writing and optimizing complex SQL queries."
      },

      { icon: <LucideCode2 className="w-5 h-5" />, title: "Soft Skills", desc: "Teamwork, problem-solving, logical thinking, stakeholder communication." },
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
  const { t } = useTranslation("translation");
  const avatarUrls = [
    "/assets/avatars/avatar_1.png",
    "/assets/avatars/avatar_2.png",
    "/assets/avatars/avatar_3.png",

  ];

  const [avatarIndex, setAvatarIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [showCV, setShowCV] = useState(false);

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
        className="flex flex-col items-center md:items-start text-center md:text-left gap-2 col-span-1 z-40"
        variants={itemVariants}
      >
        {/* Avatar */}
        <div className="relative">
          <Avatar
            className="w-32 h-32 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-500 
                dark:from-transparent dark:via-transparent dark:to-transparent 
                ring-4 ring-blue-500 dark:ring-green-600 
                shadow-lg shadow-indigo-400/30
                hover:scale-105 transition-transform duration-300 overflow-hidden"
          >
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
          {t("personal_cv.name")} <p className="text-sm text-sky-500 dark:text-zinc-400">(Nissan)</p>
        </h1>
        <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
          {t("personal_cv.role")}
        </p>

        {/* Collapsible: Passion for Coding */}
        <Collapsible className="w-full">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-sky-400 hover:underline transition group">
            <Sparkles className="w-4 h-4 group-hover:animate-pulse text-blue-500" />
            <span className="text-gray-600 text-md font-heading dark:text-blue-400">{t("personal_cv.passion.title")}</span>
            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 pl-4 text-sm text-green-950 dark:text-gray-200 leading-relaxed font-heading italic">
            {t("personal_cv.passion.description")}
          </CollapsibleContent>
        </Collapsible>
        <Separator orientation="horizontal" className="bg-gray-400 w-full h-1  z-50 " />




        {/* Contact Info */}
        <div className="pl-4 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
          <p className="flex items-center gap-2 group transition-colors hover:text-amber-600 dark:hover:text-amber-400">
            <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110 transition-all" />
            <span className="text-sm">{t("personal_cv.contact.email")}</span>

          </p>
          <p className="flex items-center gap-2 group transition-colors hover:text-amber-600 dark:hover:text-amber-400">
            <Phone className="w-4 h-4 text-green-500 dark:text-green-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110 transition-all" />
            <span className="text-sm">{t("personal_cv.contact.phone")}</span>

          </p>
          <p className="flex items-center gap-2 group transition-colors hover:text-amber-600 dark:hover:text-amber-400">
            <MapPin className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:scale-110 transition-all" />
            <span className="text-sm">{t("personal_cv.contact.location")}</span>

          </p>
        </div>

        <Separator orientation="horizontal" className="bg-gray-400 w-full h-1  z-50 " />


        {/* Collapsible: Social Links */}
        <Collapsible className="mt-2 w-full">
          <CollapsibleTrigger
            className="flex items-center gap-3 text-base font-semibold text-slate-700 dark:text-sky-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            aria-label="Toggle social links section"
          >
            <Share2 className="w-5 h-5 text-blue-500 group-hover:animate-pulse transition-transform" />
            <span className="text-gray-700 dark:text-blue-300 font-heading">
              {t("personal_cv.social.title")}
            </span>
            <ChevronDown className="w-5 h-5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-3 text-base text-zinc-600 dark:text-zinc-200 pl-6">
            <div className="space-y-3">
              {/* CV Button */}
              <button
                onClick={() => setShowCV(!showCV)}
                className="flex items-center gap-3 group transition-colors hover:text-blue-600 dark:hover:text-blue-400 w-full text-left"
                aria-label="View CV"
              >
                <CgProfile className="text-green-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="hover:underline underline-offset-4 truncate">
                  {t("personal_cv.cv.title")}
                </span>
              </button>

              <PDFDialogViewer
                open={showCV}
                onClose={() => setShowCV(false)}
                url="https://minio.deepbim.net:9000/deepbim-fe/1749613526811-CV_Nguyen_Ngoc_Due_Web_Developer.pdf"
                fileName="CV_Nguyen_Ngoc_Due_Web_Developer.pdf"
              />

              {/* Social Links */}
              <div className="space-y-3">
                <a
                  href="https://www.linkedin.com/in/nguyen-ngoc-due-28a777196/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label="Visit LinkedIn profile"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="hover:underline underline-offset-4 truncate">
                    linkedin.com/in/nguyen-ngoc-due
                  </span>
                </a>

                <a
                  href="https://deepbim.net/examples/bim-viewer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors hover:text-teal-600 dark:hover:text-teal-400"
                  aria-label="Visit portfolio website"
                  title="Portfolio Website"
                >
                  <Globe className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span className="hover:underline underline-offset-4 truncate">
                    deepbim.net/examples/bim-viewer
                  </span>
                </a>

                <a
                  href="https://github.com/nguyenngocdue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors hover:text-gray-800 dark:hover:text-white"
                  aria-label="Visit GitHub profile"
                  title="GitHub Profile"
                >
                  <Github className="w-5 h-5 text-gray-500 group-hover:scale-110 transition-transform" />
                  <span className="hover:underline underline-offset-4 truncate">
                    github.com/nguyenngocdue
                  </span>
                </a>

                <a
                  href="https://www.youtube.com/@Bim3DM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors hover:text-red-600 dark:hover:text-red-400"
                  aria-label="Visit YouTube channel"
                  title="YouTube Channel"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/icons/youtube.png" alt="YouTube icon" />
                  </Avatar>
                  <span className="hover:underline underline-offset-4 truncate">
                    youtube.com/@Bim3DM
                  </span>
                </a>
              </div>
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
