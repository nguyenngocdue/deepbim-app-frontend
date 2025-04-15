import { useTranslation } from "react-i18next";
import BenefitCard from "../components/BenefitCard";
import { FaCubes, FaShieldAlt, FaDatabase } from "react-icons/fa";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const BenefitsSection = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      className="px-6 md:px-10 py-20  text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h2 className="text-4xl font-bold">{t("benefits.title")}</h2>
      <p className="mt-4 text-gray-600">{t("benefits.description")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 auto-rows-fr">
        {[
          { icon: <FaCubes />, title: t("benefits.items.visualization.title"), desc: t("benefits.items.visualization.desc") },
          { icon: <FaShieldAlt />, title: t("benefits.items.data_ownership.title"), desc: t("benefits.items.data_ownership.desc") },
          { icon: <FaDatabase />, title: t("benefits.items.bim_utilization.title"), desc: t("benefits.items.bim_utilization.desc") },
        ].map((item, index) => (
          <motion.div key={index} custom={index} variants={cardVariants} initial="hidden" animate="visible" className="h-full">
            <BenefitCard icon={item.icon} title={item.title} description={item.desc} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default BenefitsSection;
