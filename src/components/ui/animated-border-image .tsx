import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedBorderImage = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, perimeter: 0 });

  useEffect(() => {
    if (!divRef.current) return;

    const updateDimensions = () => {
      const { width, height } = divRef.current.getBoundingClientRect();
      const perimeter = 2 * (width + height); // Tính chu vi khung ảnh
      setDimensions({ width, height, perimeter });
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
          src="https://viralution.io/app.png"
          alt="3D Model"
          className="w-full shadow-lg rounded-lg relative z-10"
        />
       
        {/* SVG Border Animation */}
        <motion.svg
          className="absolute inset-0 pointer-events-none"
          width={dimensions.width + 10}
          height={dimensions.height + 10}
          viewBox={`0 0 ${dimensions.width + 10} ${dimensions.height + 10}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            top: -5,
            left: -5,
            right: -5,
            bottom: -5,
          }}
        >
           <defs>
          <linearGradient id="gradient-border" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff00" />  {/* Màu xanh lá */}
            <stop offset="50%" stopColor="#00ffff" />  {/* Màu xanh cyan */}
            <stop offset="100%" stopColor="#00ff00" />  {/* Quay lại xanh lá */}
          </linearGradient>
        </defs>
          <motion.rect
            x="5"
            y="5"
            width={dimensions.width}
            height={dimensions.height}
            rx="12"
            stroke="url(#gradient-border)"
            strokeWidth="3"
            strokeDasharray={dimensions.perimeter / 4} // Chỉ 1 đoạn sáng
            strokeDashoffset={dimensions.perimeter}
            animate={{
              strokeDashoffset: [dimensions.perimeter, 0], // Chạy vòng quanh
            }}
            transition={{
              duration: 8, // Điều chỉnh tốc độ chạy
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.svg>
      </div>
    </div>
  );
};

export default AnimatedBorderImage;
