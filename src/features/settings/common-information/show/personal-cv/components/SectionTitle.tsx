import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionTitleProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  description,
  icon,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div className="mb-6 text-center" ref={ref}>
      <motion.h2
        className="inline-flex items-center justify-center gap-2 text-3xl font-bold mb-2 text-zinc-800 dark:text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {icon && (
          <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        )}
        {title}
      </motion.h2>

      {description && (
        <motion.p
          className="text-md text-zinc-600 dark:text-zinc-400"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
