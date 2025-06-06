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
    <motion.div
      ref={ref}
      className="mb-10 text-center group cursor-default"
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      whileHover="hover"
      variants={{
        hidden: { opacity: 0, y: 60 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: "easeOut",
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <motion.h2
        className="inline-flex items-center justify-center gap-2 text-4xl font-bold mb-3 text-zinc-800 dark:text-white"
        variants={{
          hidden: { opacity: 0, y: 40 },
          show: { opacity: 1, y: 0 },
          hover: {
            scale: 1.08,
            transition: { type: "spring", stiffness: 200, damping: 14 },
          },
        }}
      >
        {icon && (
          <motion.span
            className="text-sky-500 dark:text-sky-400"
            variants={{
              hover: { scale: 1.15 },
            }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.span>
        )}
        {title}
      </motion.h2>

      {description && (
        <motion.p
          className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 px-4 max-w-2xl mx-auto"
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0 },
            hover: {
              y: -2,
              scale: 1.03,
              transition: { type: "spring", stiffness: 180, damping: 16 },
            },
          }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};
