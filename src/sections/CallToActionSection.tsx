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
    <section className="bg-gradient-to-r from-green-800 to-green-500 text-white py-16 text-center">
      <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
      <p className="mt-4">{t("cta.description")}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex justify-center gap-3">
        <input
          type="email"
          placeholder={t("cta.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg text-gray-800 focus:outline-none w-64"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-100 text-green-800 rounded-lg shadow-md hover:bg-green-200 transition"
        >
          {t("cta.button")}
        </button>
      </form>

      {error && <p className="mt-2 text-red-400">{error}</p>}
    </section>
  );
};

export default CallToActionSection;
