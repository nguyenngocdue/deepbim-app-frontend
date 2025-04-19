import { useState } from "react";
import { useTranslation } from "react-i18next";

const CallToActionSection = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError(t("cta.error"));
      return;
    }
    setError("");
    alert(t("cta.success"));
  };

  return (
    <section className="bg-gradient-to-r from-green-800 to-green-500 text-white py-10 sm:py-12 md:py-16 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>
      <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
        {t("cta.description")}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 px-4 sm:px-0">
        <input
          type="email"
          placeholder={t("cta.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 w-full sm:w-64 text-sm sm:text-base"
        />
        <button
          type="submit"
          className="px-4 sm:px-6 py-2 sm:py-3 bg-green-100 text-green-800 rounded-lg shadow-md hover:bg-green-200 transition text-sm sm:text-base"
        >
          {t("cta.button")}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-red-400 text-xs sm:text-sm max-w-md mx-auto">
          {error}
        </p>
      )}
    </section>
  );
};

export default CallToActionSection;