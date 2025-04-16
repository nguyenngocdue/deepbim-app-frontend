import { useTranslation } from "react-i18next";
import FeatureCard from "../components/FeatureCard";
import { FaDatabase, FaHistory, FaSyncAlt, FaProjectDiagram } from "react-icons/fa";
import SectionWrapper from "@/components/SectionWrapper";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FaDatabase />,
      title: t("features.items.feature_1.title"),
      description: t("features.items.feature_1.desc"),
      image: "https://viralution.io/data.png",
    },
    {
      icon: <FaHistory />,
      title: t("features.items.feature_2.title"),
      description: t("features.items.feature_2.desc"),
      image: "https://viralution.io/version.png",
    },
    {
      icon: <FaSyncAlt />,
      title: t("features.items.feature_3.title"),
      description: t("features.items.feature_3.desc"),
      image: "https://viralution.io/changes.png",
    },
    {
      icon: <FaProjectDiagram />,
      title: t("features.items.feature_4.title"),
      description: t("features.items.feature_4.desc"),
      image: "https://viralution.io/combine.png",
    },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 section-wrapper text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
        {t("features.title")}
      </h2>
      <div className="grid  sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <SectionWrapper key={index}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              image={feature.image}
            />
          </SectionWrapper>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;