import { useTranslation } from "react-i18next";
import BenefitCard from "../components/BenefitCard";
import { FaCubes, FaShieldAlt, FaDatabase } from "react-icons/fa";

const BenefitsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-10 py-20 bg-gray-100 text-center">
      <h3 className="text-3xl font-bold">{t("benefits.title")}</h3>
      <p className="mt-4 text-gray-600">{t("benefits.description")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <BenefitCard
          icon={<FaCubes />}
          title={t("benefits.items.visualization.title")}
          description={t("benefits.items.visualization.desc")}
        />
        <BenefitCard
          icon={<FaShieldAlt />}
          title={t("benefits.items.data_ownership.title")}
          description={t("benefits.items.data_ownership.desc")}
        />
        <BenefitCard
          icon={<FaDatabase />}
          title={t("benefits.items.bim_utilization.title")}
          description={t("benefits.items.bim_utilization.desc")}
        />
      </div>
    </section>
  );
};

export default BenefitsSection;
