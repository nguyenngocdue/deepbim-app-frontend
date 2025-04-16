import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SolutionCard from "@/components/SolutionCard";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

const SolutionsSection = () => {
  const { t } = useTranslation();

  const solutions = [
    {
      title: t("solutions.items.own_data.title"),
      description: t("solutions.items.own_data.desc"),
      image: "https://viralution.io/own_data.png",
    },
    {
      title: t("solutions.items.data_utilization.title"),
      description: t("solutions.items.data_utilization.desc"),
      image: "https://viralution.io/app.png",
    },
    {
      title: "Bitcoin",
      description:
        "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
      image: "https://viralution.io/bitcoin.png",
    },
  ];

  return (
    <section className={`${CLASS_NAME_DEFAULT.CLASS_NAME_2} relative overflow-hidden`}>
      {/* Background Gradient */}
      <h2 className="text-4xl font-bold">{t("solutions.title")}</h2>
      <p className="mt-4 text-gray-600 max-w-xl mx-auto">{t("solutions.description")}</p>

      {/* Wrapper chứa Slider + Card Cố Định */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-10">
        {/* Slider Container */}
        <div className="relative w-full max-w-2xl overflow-hidden p-5 border rounded-2xl border-zinc-600 ">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 12,
              ease: "linear",
            }}
          >
            {/* Nhân đôi danh sách để trượt liên tục mà không bị reset */}
            {[...solutions, ...solutions].map((solution, index) => (
              <motion.div
                key={index}
                className="relative min-w-[260px] md:min-w-[300px] bg-white rounded-3xl shadow-xl p-6 transition duration-300 
                          hover:scale-105 hover:z-10 hover:shadow-2xl will-change-transform"
              >
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="w-full h-36 object-cover rounded-xl"
                />
                <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-900">{solution.title}</h3>
                <p className="mt-2 text-gray-600 text-sm md:text-base">{solution.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Card Cố Định */}
        <div className="relative w-full max-w-md">
          <SolutionCard
            title={t("solutions.items.data_utilization.title")}
            description={t("solutions.items.data_utilization.desc")}
            image="https://viralution.io/app.png"
            className="opacity-100 hover:opacity-100 transition-none" // Fix opacity
          />
        </div>

      </div>
    </section>
  );
};

export default SolutionsSection;
