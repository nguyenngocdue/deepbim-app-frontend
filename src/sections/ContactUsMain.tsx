import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

// Tailwind class tách riêng
const sectionClasses = "hero min-h-svh px-6 md:px-10 py-16 bg-white overflow-y-auto flex items-center";
const contentWrapperClasses = "w-full max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start";
const textContainerClasses = "md:col-span-7 text-center md:text-left";
const titleClasses = "text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-green-900 via-green-500 to-green-300 bg-clip-text text-transparent";
const subtitleClasses = "text-zinc-600 text-lg md:text-xl";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut", delay: 0.2 } },
};

interface ContactUsMainProps {
  titleKey?: string;
  subtitleKey?: string;
}

const ContactUsMain: React.FC<ContactUsMainProps> = ({
  titleKey = "contact_us.title",
  subtitleKey = "contact_us.subtitle",
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const title = useMemo(() => t(titleKey), [t, titleKey, language]);
  const subtitle = useMemo(() => t(subtitleKey), [t, subtitleKey, language]);

  return (
    <motion.section
      className={sectionClasses}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-label="Contact Us Section"
    >
      <div className={contentWrapperClasses}>
        <motion.div
          className={textContainerClasses}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tiêu đề */}
          <h1 aria-label={title}>
            <span className={titleClasses}>{title}</span>
          </h1>

          {/* Subtitle tĩnh */}
          <p className={`${subtitleClasses} mt-4`}>{subtitle}</p>

          {/* Thông tin liên hệ */}
          <div className="mt-8 space-y-4 text-base md:text-lg text-gray-700">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <FaPhoneAlt className="text-green-600 min-w-[20px]" />
              <span>{t("contact_us.contact_info.phone")}</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <FaEnvelope className="text-green-600 min-w-[20px]" />
              <span>{t("contact_us.contact_info.email")}</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <FaMapMarkerAlt className="text-green-600 min-w-[20px]" />
              <span>{t("contact_us.contact_info.address")}</span>
            </div>
          </div>
        </motion.div>

        {/* Nếu muốn thêm hình ảnh, bản đồ, hoặc illustration ở cột phải, bạn có thể thêm tại đây: */}
        {/* <div className="md:col-span-5 ...">Hình ảnh hoặc mô tả</div> */}
      </div>
    </motion.section>
  );
};

export default ContactUsMain;
