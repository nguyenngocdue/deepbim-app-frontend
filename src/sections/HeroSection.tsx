import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedBorderImage3 from "@/components/ui/animated-border-image3";

const HeroSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage(); // Get current language from context

  // Dynamically update subtitle based on language
  const subtitle = useMemo(() => t("hero.subtitle") || "", [t, language]);

  // console.log(language, subtitle); // Debugging output

  return (
    <motion.section
      className="px-6 md:px-16 py-20 flex flex-col md:flex-row items-center justify-between gap-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Left Content */}
      <motion.div
        className="w-full md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          {t("hero.welcome")}{" "}
          {subtitle && (
            <TypeAnimation
              key={language} // 🔥 Ensure animation resets when language changes
              sequence={[
                subtitle, // Type the subtitle
                1500, // Hold for 1.5 seconds
                "", // Erase text
                500, // Pause for 0.5 seconds
                subtitle, // Retype
              ]}
              wrapper="span"
              speed={40} // Smooth typing speed
              repeat={Infinity} // Loop infinitely
              className="text-green-500"
            />
          )}
        </h1>
        <motion.p
          className="mt-6 text-lg text-gray-600 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {t("hero.description")}
        </motion.p>

        {/* Buttons */}
        <div className="mt-8 flex gap-4 justify-center md:justify-start">
          <motion.button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
            <a href="/apps/home">{t("hero.start")}</a>
          </motion.button>
          <motion.button className="px-6 py-3 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition">
            {t("hero.deploy")}
          </motion.button>
        </div>
      </motion.div>
      <AnimatedBorderImage3 imgUrl="https://viralution.io/app.png" />
    </motion.section>
  );
};

export default HeroSection;
