import AnimatedBorderImage from "@/components/ui/animated-border-image ";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-10 py-20 flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left Content */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          {t("hero.welcome")} <span className="text-green-500">{t("hero.subtitle")}</span>
        </h2>
        <p className="mt-6 text-gray-600">{t("hero.description")}</p>
        <div className="mt-6 flex gap-4 justify-center md:justify-start">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            {t("hero.start")}
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-200 transition">
            {t("hero.deploy")}
          </button>
        </div>
      </div>

      {/* Right Image with Animated Border */}
      <AnimatedBorderImage />
    </section>
  );
};

export default HeroSection;
