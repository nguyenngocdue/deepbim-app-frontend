import { motion } from "framer-motion";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <motion.div
      className="relative p-6 bg-white shadow-lg shadow-zinc-600 rounded-lg flex flex-col items-center text-center transition-all overflow-hidden h-full border border-transparent "
      whileHover={{
        scale: 1.05, // Slight zoom effect on hover
        borderColor: "#22c55e", // Green border on hover
        boxShadow: "0px 10px 30px rgba(34, 197, 94, 0.4)", // Glowing green effect
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Icon */}
      <motion.div
        className="text-green-500 text-5xl transition-all"
        whileHover={{ color: "#16a34a" }} // Slightly darker green on hover
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>

      {/* Title with Underline Effect */}
      <motion.div className="relative mt-4">
        <h4 className="text-xl font-bold transition-all text-zinc-700">{title}</h4>

        {/* Underline Animation */}
        <motion.div
          className="absolute left-0 bottom-[-3px] h-[3px] bg-green-500 rounded-full"
          initial={{ width: "0%" }} // Hidden initially
          whileHover={{ width: "100%" }} // Expands fully on hover
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* Description */}
      <motion.p
        className="mt-2 text-gray-600 transition-all"
        whileHover={{ color: "#16a34a" }} // Slightly darker green on hover
        transition={{ duration: 0.4 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default BenefitCard;
