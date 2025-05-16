import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedBorderImage3 from "@/components/ui/animated-border-image3";
import { Button } from "@/components/ui/button";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { Link } from "@tanstack/react-router";
import AppButton from "@/components/bim-viewer/common/AppButton";

const HeroSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const subtitle = useMemo(() => t("hero.subtitle") || "", [t, language]);
  const subtitleClasses = CLASS_NAME_DEFAULT.CLASS_NAME_6;

  // Detect screen size to disable TypeAnimation on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.section
      className={CLASS_NAME_DEFAULT.CLASS_NAME_1}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="w-full md:w-1/2 text-center md:text-left mt-7 sm:mt-7 md:mt-7"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {t("hero.welcome")}{" "}
          {subtitle && (
            isSmallScreen ? (
              <span className="subtitle text-green-500">{subtitle}</span>
            ) : (
              <TypeAnimation
                key={language}
                sequence={[subtitle, 1500, "", 500, subtitle]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
                className={`subtitle text-green-500 ${subtitleClasses}`}
              />
            )
          )}
        </h1>
        <motion.p
          className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {t("hero.description")}
        </motion.p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link to="/managements/home">
            <AppButton 
              className="bg-button-1 text-white dark:bg-green-600 dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900" 
              falseName={t("hero.start")}
              >
              {t("hero.start")}
            </AppButton>
          </Link>
          <Link to="/managements/me">
            <AppButton 
              className="bg-button-2 text-white bg-gray-700 hover:bg-zinc-900 dark:hover:bg-gray-400" 
              falseName={t("hero.deploy")}
              >
              {t("hero.deploy")}
            </AppButton>
          </Link>
        </div>
      </motion.div>
      <div className="w-full md:w-1/2 flex justify-center">
        <AnimatedBorderImage3 imgUrl="https://viralution.io/app.png" alt="3D" className="" />
      </div>
    </motion.section>
  );
};

export default HeroSection;