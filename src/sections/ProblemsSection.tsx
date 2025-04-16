import { useTranslation } from "react-i18next";
import { FaExclamationCircle, FaComments, FaClock } from "react-icons/fa";
import SectionWrapper from "@/components/SectionWrapper";
import GenericCard from "@/components/GenericCard";

const ProblemsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-10 py-20 text-center">
      <h2 className="text-4xl font-bold">{t("problems.title")}</h2>
      <p className="mt-4 text-gray-600">{t("problems.description")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

        <SectionWrapper>
        <GenericCard
          icon={<FaExclamationCircle />}
          title={t("problems.items.platform_dependency.title")}
          description={t("problems.items.platform_dependency.desc")}
          backgroundColor="bg-white"
          textColor="text-yellow-800"
          shadowColor="shadow-zinc-600"
          className="shadow-zinc-700" 
        />


        </SectionWrapper>
        <SectionWrapper>
        <GenericCard
          icon={<FaComments />}
          title={t("problems.items.platform_dependency.title")}
          description={t("problems.items.platform_dependency.desc")}
          backgroundColor="bg-white"
          textColor="text-yellow-500"
          shadowColor="shadow-zinc-600"
          className="shadow-zinc-700" 
        />
        </SectionWrapper>
        <SectionWrapper>
        <GenericCard
          icon={<FaClock />}
          title={t("problems.items.downtime_disruptions.title")}
          description={t("problems.items.downtime_disruptions.desc")}
          textColor="text-blue-500"
          backgroundColor="bg-white"
          shadowColor="shadow-zinc-600"
          className="shadow-zinc-700" 
        />
        </SectionWrapper>
      </div>
    </section>
  );
};

export default ProblemsSection;
