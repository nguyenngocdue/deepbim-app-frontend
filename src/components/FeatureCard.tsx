import { ReactNode } from "react";
import { motion } from "framer-motion";
import AnimatedBorderImage from "./ui/animated-border-image ";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
}

const FeatureCard = ({ icon, title, description, image }: FeatureCardProps) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-10 px-6 rounded-lg shadow-lg transition-all duration-500"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "#1e293b", color: "#f8fafc" }} // Dark modern background with readable text
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="md:w-1/2 text-left">
        <motion.div
          className="flex items-center gap-4 transition-all"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {/* Icon with Modern Hover Effect */}
          <motion.div
            className="text-green-400 text-5xl transition-all"
            whileHover={{ rotate: 10, color: "#facc15" }} // Icon turns yellowish for contrast
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
          <div>
            {/* Title with Underline Animation */}
            <motion.h3
              className="text-2xl font-bold relative transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ color: "#f8fafc" }} // Title turns soft white for contrast
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {title}
              <motion.div
                className="absolute left-0 bottom-[-3px] h-[3px] bg-yellow-400 rounded-full"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-gray-300 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ color: "#f8fafc" }} // Text turns white for readability
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {description}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Image Section */}
      <motion.div
        className="md:w-1/2 transition-all"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatedBorderImage imgUrl={image} />
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;
