import ForceGraph from "@/components/ForceGraph";
import DownloadButton from "@/components/ui/download-button";
import { useTranslation } from "react-i18next";

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-wrapper px-4 sm:px-6 md:px-10 py-10 sm:py-16 md:py-20 bg-white text-center">
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