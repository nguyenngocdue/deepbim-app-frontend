import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GenericCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  backgroundColor?: string;     // Tailwind or custom
  textColor?: string;           // Tailwind or custom
  shadowColor?: string;         // rgba() or hex
  hoverEffect?: boolean;
  className?: string;
}

const GenericCard: React.FC<GenericCardProps> = ({
  icon,
  title,
  description,
  backgroundColor = "bg-white",
  textColor = "text-gray-800",
  shadowColor = "rgba(0, 0, 0, 0.1)",
  hoverEffect = true,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative p-6 rounded-lg shadow-lg text-center flex flex-col items-center overflow-hidden ${backgroundColor} ${textColor} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hoverEffect
          ? {
              scale: 1.05,
              boxShadow: `0px 10px 25px ${shadowColor}`,
            }
          : {}
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Icon */}
      {icon && (
        <motion.div
          className="text-4xl p-4 rounded-full bg-opacity-10"
          whileHover={hoverEffect ? { rotate: 10 } : {}}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
      )}

      {/* Title */}
      <h4 className="mt-4 text-xl font-semibold">{title}</h4>

      {/* Description */}
      {description && (
        <motion.p
          className="mt-2 text-sm text-gray-600"
          whileHover={hoverEffect ? { y: -3 } : {}}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default GenericCard;
