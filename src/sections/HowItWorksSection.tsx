import { useTranslation } from "react-i18next";

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="px-6 md:px-10 py-20 bg-white text-center">
      <h2 className="text-3xl font-bold">{t("how_it_works.title")}</h2>
      <p className="mt-4 text-gray-600">{t("how_it_works.description")}</p>

      {/* Image Diagram */}
      <div className="flex justify-center mt-10">
        <img
          src="https://viralution.io/how_it_works.png"
          alt="How It Works Diagram"
          className="w-full max-w-2xl"
        />
      </div>

      {/* Download Button */}
      <div className="mt-6">
        <a
          href="/download"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          <span className="mr-2">🔽</span> {t("how_it_works.download")}
        </a>
      </div>
    </section>
  );
};

export default HowItWorksSection;
