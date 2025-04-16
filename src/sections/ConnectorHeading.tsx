import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedBorderImage3 from "@/components/ui/animated-border-image3";

// Tách các class Tailwind để dễ đọc và bảo trì
const sectionClasses = "hero px-6 md:px-16 pt-20 flex flex-col md:flex-row items-center justify-between gap-12";
const textContainerClasses = "w-full md:w-1/2 text-center md:text-left";
const titleClasses = "text-6xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-green-900 via-green-500 to-green-300 bg-clip-text text-transparent";
const subtitleClasses = "text-zinc-300 text-xl"; // Điều chỉnh kích thước chữ để cân đối

// Định nghĩa animation variants để tái sử dụng
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut", delay: 0.2 } },
};

// Props để linh hoạt hơn
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

  // Cache giá trị dịch
  const title = useMemo(() => t(titleKey) || "Default Title", [t, titleKey, language]);
  const subtitle = useMemo(() => t(subtitleKey) || "Default Subtitle", [t, subtitleKey, language]);

  // Điều chỉnh animation dựa trên reduce motion
  const animationSequence = shouldReduceMotion
    ? [subtitle]
    : [subtitle, 1500, "", 500, subtitle];

  return (
    <motion.section
      className={sectionClasses}
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
        <h1  aria-label={title}>
          <span className={titleClasses}>{title}</span>
        </h1>
        <TypeAnimation
          key={language}
          sequence={animationSequence}
          wrapper="p"
          speed={40}
          repeat={shouldReduceMotion ? 0 : Infinity}
          className={subtitleClasses}
          aria-live="polite"
        />
      </motion.div>
      <AnimatedBorderImage3 imgUrl={imageUrl} alt={altText} />
    </motion.section>
  );
};

export default ConnectorHeading;