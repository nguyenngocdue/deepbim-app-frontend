import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedBorderImageProps {
  imgUrl: string;
}

const AnimatedBorderImage = ({ imgUrl }: AnimatedBorderImageProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    perimeter: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (!divRef.current) return;
      const { width, height } = divRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setDimensions({
          width,
          height,
          perimeter: 2 * (width + height),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="relative flex justify-center items-center">
      {/* Container chứa ảnh */}
      <div ref={divRef} className="relative w-full max-w-4xl">
        {/* Ảnh */}
        <img
          src={imgUrl}
          alt="3D Model"
          className="w-full h-auto shadow-xl rounded-xl relative z-10"
        />

        {/* Hiệu ứng viền động */}
        {dimensions.width > 0 && dimensions.height > 0 && (
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            width="100%"
            height="100%"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gradient-border" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff00" />
                <stop offset="50%" stopColor="#00ffff" />
                <stop offset="100%" stopColor="#00ff00" />
              </linearGradient>
            </defs>
            <motion.rect
              x="1"
              y="1"
              width={dimensions.width - 2}
              height={dimensions.height - 2}
              rx="10"
              stroke="url(#gradient-border)"
              strokeWidth="3"
              strokeDasharray={dimensions.perimeter/4}
              strokeDashoffset={dimensions.perimeter}
              animate={{
                strokeDashoffset: [dimensions.perimeter, 0], // Reset lại về ban đầu
              }}
              transition={{
                duration: 8, // Điều chỉnh thời gian chạy hiệu ứng
                repeat: Infinity, // Chạy liên tục
                ease: "linear",
              }}
            />
          </motion.svg>
        )}
      </div>
    </div>
  );
};

export default AnimatedBorderImage;
