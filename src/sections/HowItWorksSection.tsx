import ForceGraph from "@/components/ForceGraph";
import DownloadButton from "@/components/ui/download-button";
import { useTranslation } from "react-i18next";

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="section-wrapper px-6 md:px-10 py-20 bg-white text-center">
      <h2 className="text-3xl font-bold">{t("how_it_works.title")}</h2>
      <p className="mt-4 text-gray-600">{t("how_it_works.description")}</p>

      {/* Image Diagram */}
      <div className="flex justify-center mt-2">
        <ForceGraph/>
      </div>
      {/* Download Button */}
      <DownloadButton textKey={t("how_it_works.download")}/>
    </section>
  );
};

export default HowItWorksSection;
