import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import AnimatedBorderImage from "@/components/ui/animated-border-image ";

const HeroSection = () => {
  const { t, ready } = useTranslation();
  const [subtitle, setSubtitle] = useState("");

  // Đảm bảo i18next load hoàn chỉnh trước khi hiển thị nội dung
  useEffect(() => {
    if (ready) {
      setSubtitle(t("hero.subtitle") || "");
    }
  }, [ready, t]);

  return (
    <motion.section
      className="px-6 md:px-16 py-20 flex flex-col md:flex-row items-center justify-between gap-12 bg-gray-50"
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
              sequence={[
                subtitle,  // Gõ chữ ra
                1500,      // Giữ nguyên trong 1.5s
                "",        // Xóa chữ
                500,       // Giữ nguyên trong 0.5s
                subtitle   // Gõ lại từ đầu
              ]}
              wrapper="span"
              speed={40} // Giảm tốc độ để tự nhiên hơn
              repeat={Infinity} // Lặp vô hạn
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

        {/* Buttons with Hover Effect */}
        <div className="mt-8 flex gap-4 justify-center md:justify-start">
          <motion.button
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition transform hover:scale-105 focus:ring-2 focus:ring-green-500 focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t("hero.start")}
          >
            {t("hero.start")}
          </motion.button>
          <motion.button
            className="px-6 py-3 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition transform hover:scale-105 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t("hero.deploy")}
          >
            {t("hero.deploy")}
          </motion.button>
        </div>
      </motion.div>
        <AnimatedBorderImage  imgUrl="https://viralution.io/app.png"/>
    </motion.section>
  );
};

export default HeroSection;
