import { motion } from "framer-motion";
import React, { useRef } from "react";
import { useInView } from "framer-motion";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper = ({ children, className }: SectionWrapperProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <motion.div
      ref={ref}
      variants={animationVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      className={`section-wrapper ${className || ""}`}
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;