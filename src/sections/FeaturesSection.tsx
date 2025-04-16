import { useTranslation } from "react-i18next";
import FeatureCard from "../components/FeatureCard";
import { FaDatabase, FaHistory, FaSyncAlt, FaProjectDiagram } from "react-icons/fa";
import SectionWrapper from "@/components/SectionWrapper";

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-10 py-20 section-wrapper text-center">
      <h2 className="text-4xl font-bold">{t("features.title")}</h2>
      <div className="mt-2 space-y-4">
        <SectionWrapper>
          <FeatureCard
            icon={<FaDatabase />}
            title={t("features.items.feature_1.title")}
            description={t("features.items.feature_1.desc")}
            image="https://viralution.io/data.png"
          />
        </SectionWrapper>
        <SectionWrapper>
          <FeatureCard
            icon={<FaHistory />}
            title={t("features.items.feature_2.title")}
            description={t("features.items.feature_2.desc")}
            image="https://viralution.io/version.png"
          />
        </SectionWrapper>
        <SectionWrapper>
          <FeatureCard
            icon={<FaSyncAlt />}
            title={t("features.items.feature_3.title")}
            description={t("features.items.feature_3.desc")}
            image="https://viralution.io/changes.png"
          />
        </SectionWrapper>
        <SectionWrapper>
          <FeatureCard
            icon={<FaProjectDiagram />}
            title={t("features.items.feature_4.title")}
            description={t("features.items.feature_4.desc")}
            image="https://viralution.io/combine.png"
          />
        </SectionWrapper>
      </div>
    </section>
  );
};

export default FeaturesSection;
