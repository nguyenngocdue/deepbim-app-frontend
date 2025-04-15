import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedBorderImage3 from "@/components/ui/animated-border-image3";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const subtitle = useMemo(() => t("hero.subtitle") || "", [t, language]);

  return (
    <motion.section
      className="hero px-6 md:px-16 py-20 flex flex-col md:flex-row items-center justify-between gap-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="w-full md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          {t("hero.welcome")}{" "}
          {subtitle && (
            <TypeAnimation
              key={language}
              sequence={[subtitle, 1500, "", 500, subtitle]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
              className="subtitle"
            />
          )}
        </h1>
        <motion.p
          className="mt-6 text-lg leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {t("hero.description")}
        </motion.p>
        <div className="mt-8 flex gap-4 justify-center md:justify-start">
          <Button className="primary-button hover">
            <a href="/apps/home">{t("hero.start")}</a>
          </Button>
          <Button className="outline-button hover">
            {t("hero.deploy")}
          </Button>
        </div>
      </motion.div>
      <AnimatedBorderImage3 imgUrl="https://viralution.io/app.png" />
    </motion.section>
  );
};

export default HeroSection;