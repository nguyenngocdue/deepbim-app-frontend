import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-10 py-20 flex items-center justify-between">
      <div className="w-1/2">
        <h2 className="text-5xl font-bold text-gray-900">
          {t("hero.welcome")} <span className="text-green-500">{t("hero.subtitle")}</span>
        </h2>
        <p className="mt-6 text-gray-600">{t("hero.description")}</p>
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 bg-green-600 text-white rounded">{t("hero.start")}</button>
          <button className="px-6 py-3 border border-gray-300 rounded">{t("hero.deploy")}</button>
        </div>
      </div>
      <div className="w-1/2">
        <img src="https://viralution.io/app.png" alt="3D Model" className="w-full shadow-lg rounded-lg" />
      </div>
    </section>
  );
};

export default HeroSection;
