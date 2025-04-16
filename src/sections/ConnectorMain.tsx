import { useTranslation } from "react-i18next";
import BenefitCard from "../components/BenefitCard";
import { FaCubes, FaShieldAlt, FaDatabase } from "react-icons/fa";
import { motion } from "framer-motion";
import BenefitCardDownload from "@/components/BenefitCardDowload";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const ConnectorMain = () => {
  const { t } = useTranslation();
  return (
    <motion.section
      className="hero px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 auto-rows-fr ">
        {[
          { src: '/images/revit_word.png', title: t("connector.items.item_1.title"), subtitles: t("connector.items.item_1.subtitles") , disable:true},
          { src: '/images/tekla.png', title: t("connector.items.item_2.title"), subtitles: t("connector.items.item_2.subtitles") , disable:false},
          { src: '/images/archicad.png', title: t("connector.items.item_3.title"), subtitles: t("connector.items.item_3.subtitles") , disable:false},
        ].map((item, index) => (
          <motion.div key={index} custom={index} variants={cardVariants} initial="hidden" animate="visible" className="h-full">
            <BenefitCardDownload 
              src= {item.src} 
              title={item.title} 
              description={item.subtitles}
              downloadLink=""
              disableDownload={item.disable}
              />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ConnectorMain;
