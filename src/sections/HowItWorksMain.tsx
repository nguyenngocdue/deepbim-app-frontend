import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useMemo } from "react";
import ForceGraph from "@/components/ForceGraph";
import DownloadButton from "@/components/ui/download-button";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut", delay: 0.2 } },
};

const sectionClasses = "hero px-6 md:px-16 pt-20 pb-10 bg-white";
const titleClasses ="text-6xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-green-900 via-green-500 to-green-300 bg-clip-text text-transparent";

const HowItWorksMain = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const title = useMemo(() => t("how_it_works.title"), [t, i18n.language]);
  const subtitle = useMemo(() => t("how_it_works.description"), [t, i18n.language]);

  const animationSequence = shouldReduceMotion
    ? [subtitle]
    : [subtitle, 2000, "", 500, subtitle];

  return (
    <motion.section
      className={sectionClasses}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-[1400px] mx-auto items-center">
        {/* Left Text */}
        <motion.div
          className="md:col-span-5 space-y-4 text-center md:text-left"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 aria-label={title}>
            <span className={titleClasses}>{title}</span>
          </h1>

          <div className="relative min-h-[56px]">
            <p className="invisible absolute text-xl">{subtitle}</p>
            <TypeAnimation
              key={i18n.language}
              sequence={animationSequence}
              wrapper="p"
              speed={50}
              repeat={shouldReduceMotion ? 0 : Infinity}
              className="text-xl text-zinc-600 relative"
              aria-live="polite"
            />
          </div>
        </motion.div>

        {/* Right: Graph */}
        <div className="md:col-span-7 flex justify-center">
          <div className="w-full max-w-[480px]">
            <ForceGraph />
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-10 text-center">
        <DownloadButton textKey={t("how_it_works.download")} />
      </div>
    </motion.section>
  );
};

export default HowItWorksMain;
