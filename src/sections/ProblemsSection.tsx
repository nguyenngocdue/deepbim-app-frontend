import { useTranslation } from "react-i18next";
import ProblemCard from "../components/ProblemCard";
import { FaExclamationCircle, FaComments, FaClock } from "react-icons/fa";
import SectionWrapper from "@/components/SectionWrapper";

const ProblemsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-10 py-20 text-center">
      <h2 className="text-3xl font-bold">{t("problems.title")}</h2>
      <p className="mt-4 text-gray-600">{t("problems.description")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

        <SectionWrapper>
          <ProblemCard
            icon={<FaExclamationCircle />}
            title={t("problems.items.platform_dependency.title")}
            description={t("problems.items.platform_dependency.desc")}
            color="text-red-500"
          />
        </SectionWrapper>
        <SectionWrapper>
          <ProblemCard
            icon={<FaComments />}
            title={t("problems.items.communication_challenges.title")}
            description={t("problems.items.communication_challenges.desc")}
            color="text-yellow-500"
          />
        </SectionWrapper>
        <SectionWrapper>
          <ProblemCard
            icon={<FaClock />}
            title={t("problems.items.downtime_disruptions.title")}
            description={t("problems.items.downtime_disruptions.desc")}
            color="text-blue-500"
          />
        </SectionWrapper>
      </div>
    </section>
  );
};

export default ProblemsSection;
