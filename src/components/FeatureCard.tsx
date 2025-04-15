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
      className="flex flex-col items-center gap-6 py-10 border-0"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="md:w-1/2 text-left">
        <motion.div 
          className="flex items-center gap-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="text-green-500 text-5xl"
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
          <div>
            <motion.h3 
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {description}
            </motion.p>
          </div>
        </motion.div>
      </div>
      <motion.div 
        className="md:w-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatedBorderImage imgUrl={image}/>
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;