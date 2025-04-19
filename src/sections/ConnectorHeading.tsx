import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedBorderImage3 from "@/components/ui/animated-border-image3";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

// Tách các class Tailwind
const sectionClasses = "hero pt-20 flex flex-col md:flex-row items-center justify-between gap-12";
const textContainerClasses = "w-full md:w-1/2 text-center md:text-left";
const titleClasses = CLASS_NAME_DEFAULT.CLASS_NAME_4;
const subtitleClasses = `${CLASS_NAME_DEFAULT.CLASS_NAME_5} `; // Cố định chiều cao, giới hạn 2 dòng

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut", delay: 0.2 } },
};

// Props
interface ConnectorHeadingProps {
  titleKey?: string;
  subtitleKey?: string;
  imageUrl?: string;
  altText?: string;
}

const ConnectorHeading: React.FC<ConnectorHeadingProps> = ({
  titleKey = "connector.title",
  subtitleKey = "connector.subtitle",
  imageUrl = "https://viralution.io/connectors.png",
  altText = "Connector illustration",
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // Kiểm tra kích thước màn hình
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Cache giá trị dịch
  const title = useMemo(() => t(titleKey) || "Default Title", [t, titleKey, language]);
  const subtitle = useMemo(() => t(subtitleKey) || "Default Subtitle", [t, subtitleKey, language]);

  // Animation sequence
  const animationSequence = shouldReduceMotion || isSmallScreen
    ? [subtitle]
    : [subtitle, 1500, "", 500, subtitle];

  return (
    <motion.section
      className={`${sectionClasses} ${CLASS_NAME_DEFAULT.CLASS_NAME_3}`}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      role="banner"
      aria-label="Connector Hero Section"
    >
      <motion.div
        className={textContainerClasses}
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 aria-label={title}>
          <span className={titleClasses}>{title}</span>
        </h1>
        {isSmallScreen ? (
          <p className={subtitleClasses} aria-live="polite">
            {subtitle}
          </p>
        ) : (
          <TypeAnimation
            key={language}
            sequence={animationSequence}
            wrapper="p"
            speed={40}
            repeat={shouldReduceMotion ? 0 : Infinity}
            className={subtitleClasses}
            aria-live="polite"
          />
        )}
      </motion.div>
      <AnimatedBorderImage3 imgUrl={imageUrl} alt={altText} className="" />
    </motion.section>
  );
};

export default ConnectorHeading;