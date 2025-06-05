import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { SimpleMap } from "@/features/sub-projects/components/SimpleMap";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut", delay: 0.2 } },
};

interface ContactUsSectionProps {
  titleKey?: string;
  subtitleKey?: string;
}

const ContactUsSection: React.FC<ContactUsSectionProps> = ({
  titleKey = "contact_us.title",
  subtitleKey = "contact_us.subtitle",
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const title = useMemo(() => t(titleKey), [t, titleKey, language]);
  const subtitle = useMemo(() => t(subtitleKey), [t, subtitleKey, language]);

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-label="Contact Us Section"
      className="w-full min-h-screen py-24 px-4 md:px-10 lg:px-20 bg-transparent"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left content */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 text-center md:text-left"
        >
          <h1 aria-label={title}>
            <span className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-green-900 via-green-500 to-green-300 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
            {subtitle}
          </p>
        </motion.div>

        {/* Right info */}
        <div className="space-y-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-green-600 text-lg" />
            <span>{t("contact_us.contact_info.phone")}</span>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-green-600 text-lg" />
            <span>{t("contact_us.contact_info.email")}</span>
          </div>
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-green-600 text-lg" />
            <span>{t("contact_us.contact_info.address")}</span>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <SimpleMap
          lat={10.7769}
          lng={106.7009}
          name="Hồ Chí Minh City"
          title="My Location"
          zoom={19}
          dark={false}
        />
      </div>
    </motion.section>
  );
};

export default ContactUsSection;
