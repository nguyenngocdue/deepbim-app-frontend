import ForceGraph from "@/components/ForceGraph";
import DownloadButton from "@/components/ui/download-button";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { useTranslation } from "react-i18next";

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className={`${CLASS_NAME_DEFAULT.CLASS_NAME_2} relative overflow-hidden`}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t("how_it_works.title")}</h2>
      <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
        {t("how_it_works.description")}
      </p>

      {/* Image Diagram */}
      <div className="flex justify-center mt-4 sm:mt-6">
        <ForceGraph />
      </div>

      {/* Download Button */}
      <div className="mt-4 sm:mt-6">
        <DownloadButton textKey={t("how_it_works.download")} />
      </div>
    </section>
  );
};

export default HowItWorksSection;