import { useTranslation } from "react-i18next";
import FeatureCard from "../components/FeatureCard";
import { FaDatabase, FaHistory, FaSyncAlt, FaProjectDiagram } from "react-icons/fa";

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-10 py-20 bg-white text-center">
      <h2 className="text-3xl font-bold">{t("features.title")}</h2>
      <div className="mt-10 space-y-16">
        <FeatureCard
          icon={<FaDatabase />}
          title={t("features.items.feature_1.title")}
          description={t("features.items.feature_1.desc")}
          image="https://viralution.io/data.png"
        />
        <FeatureCard
          icon={<FaHistory />}
          title={t("features.items.feature_2.title")}
          description={t("features.items.feature_2.desc")}
          image="https://viralution.io/version.png"
        />
        <FeatureCard
          icon={<FaSyncAlt />}
          title={t("features.items.feature_3.title")}
          description={t("features.items.feature_3.desc")}
          image="https://viralution.io/changes.png"
        />
        <FeatureCard
          icon={<FaProjectDiagram />}
          title={t("features.items.feature_4.title")}
          description={t("features.items.feature_4.desc")}
          image="https://viralution.io/combine.png"
        />
      </div>
    </section>
  );
};

export default FeaturesSection;
