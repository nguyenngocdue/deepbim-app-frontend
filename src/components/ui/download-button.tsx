import React from "react";
import { useTranslation } from "react-i18next";

interface DownloadButtonProps {
  href?: string;
  textKey: string;
  icon?: React.ReactNode;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  href = "/",
  textKey,
  icon = "🎉",
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <a
      href={href}
      className={`relative inline-flex items-center justify-center px-6 py-3 font-semibold shadow-md transition-all
                 rounded-full border border-transparent  hover:text-green-700 hover:shadow-lg ${className}`}
      style={{
       background: "linear-gradient(90deg, #16A34A, #059669)",
      }}
    >
      {/* Gradient Border Animation */}
      <span
        className="absolute inset-0 rounded-full"
      ></span>
      {/* Left Icon */}
      <span className="mr-2 text-lg">{icon}</span>
      {/* Button Text with Gradient Fill */}
      <span
        className="font-bold text-white"
      >
        {t(textKey)}
      </span>

      {/* Right Arrow */}
      <span
        className="ml-2 text-gray-500 transition-transform duration-200 group-hover:translate-x-1"
        style={{
          transition: "transform 0.3s ease-in-out",
        }}
      >
        ➤
      </span>
    </a>
  );
};

export default DownloadButton;
