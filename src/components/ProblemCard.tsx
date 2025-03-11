import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ProblemCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

const ProblemCard = ({ icon, title, description, color }: ProblemCardProps) => {
  return (
    <motion.div
      className="relative bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center transition-transform overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0px 10px 30px rgba(255, 200, 0, 0.4)`, // Updated to yellow glow
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Icon with Yellow Background */}
      <motion.div
        className={`text-5xl p-4 rounded-full bg-opacity-10 ${color}`}
        whileHover={{ rotate: 10 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>

      {/* Title with Yellow Underline Effect */}
      <div className="relative mt-4">
        <h4 className="text-xl font-semibold">{title}</h4>
        <motion.div
          className="absolute left-0 bottom-[-4px] h-[3px] bg-yellow-500 rounded-full" // Yellow underline
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Description */}
      <motion.p
        className="mt-2 text-gray-600"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default ProblemCard;
