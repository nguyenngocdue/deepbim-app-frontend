import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedBorderImageProps {
  imgUrl: string;
  alt: string;
}


const AnimatedBorderImage3 = ({imgUrl, alt } : AnimatedBorderImageProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, perimeter: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (!divRef.current) return;
      const { width, height } = divRef.current.getBoundingClientRect();
      setDimensions({ width, height, perimeter: 2 * (width + height) });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="relative flex justify-center items-center">
      {/* Image Container */}
      <div ref={divRef} className="relative">
        <img
          src={imgUrl}
          alt={alt}
          className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-xl rounded-xl relative z-10"
        />

        {/* SVG Border Animation */}
        <motion.svg
          className="absolute inset-0 pointer-events-none"
          width={dimensions.width + 20} // Increase size to prevent border cropping
          height={dimensions.height + 20}
          viewBox={`0 0 ${dimensions.width + 20} ${dimensions.height + 20}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            top: -10,
            left: -10,
            right: -10,
            bottom: -10,
          }}
        >
          <defs>
            <linearGradient id="gradient-border" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff00" />
              <stop offset="50%" stopColor="#00ffff" />
              <stop offset="100%" stopColor="#00ff00" />
            </linearGradient>
          </defs>
          <motion.rect
            x="10"
            y="10"
            width={dimensions.width}
            height={dimensions.height}
            rx="10"
            stroke="url(#gradient-border)"
            strokeWidth="3" // Increase border thickness
            strokeDasharray={dimensions.perimeter / 6} // Reduce spacing between glow segments
            strokeDashoffset={dimensions.perimeter}
            animate={{ strokeDashoffset: [dimensions.perimeter, 0] }}
            transition={{
              duration: 8, // Adjust speed of glowing border
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.svg>
      </div>
    </div>
  );
};

export default AnimatedBorderImage3;