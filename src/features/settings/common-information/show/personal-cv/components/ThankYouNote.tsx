import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Handshake } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ThankYouNote() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000); // 10s
    return () => clearTimeout(timer);
  }, []);
  const { t } = useTranslation("translation");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-6 z-50 w-[90%] sm:w-[400px] p-4 rounded-xl 
                     bg-gradient-to-br from-blue-100 via-white to-green-100 
                     dark:from-[#2a2f4a] dark:via-[#1f243a] dark:to-[#2e3b55] 
                     border border-blue-200 dark:border-zinc-700 shadow-lg 
                     space-y-3 text-left"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
            <Sparkles className="w-5 h-5 animate-bounce" />
            <h2 className="text-base font-semibold text-zinc-800 dark:text-white">
            {t("personal_cv.thank_you.title")}
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
            {t("personal_cv.thank_you.note")}
          </p>
          <div className="flex justify-end text-green-600 dark:text-green-400">
            <Handshake className="w-4 h-4" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
