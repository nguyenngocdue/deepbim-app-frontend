import { useTranslation } from "react-i18next";
import SolutionCard from "../components/SolutionCard";

const SolutionsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-10 py-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold">{t("solutions.title")}</h2>
      <p className="mt-4 text-gray-600">{t("solutions.description")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <SolutionCard
          title={t("solutions.items.own_data.title")}
          description={t("solutions.items.own_data.desc")}
          image="https://viralution.io/own_data.png"
        />
        <SolutionCard
          title={t("solutions.items.data_utilization.title")}
          description={t("solutions.items.data_utilization.desc")}
          image="https://viralution.io/app.png"
        />
      </div>
    </section>
  );
};

export default SolutionsSection;
