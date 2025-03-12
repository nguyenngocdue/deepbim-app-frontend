import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedBorderImage = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!divRef.current) return;

    const updateDimensions = () => {
      const { width, height } = divRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
      setDimensions({ width, height });
    };

    // Dùng ResizeObserver để cập nhật kích thước khi thay đổi
    const resizeObserver = new ResizeObserver(() => updateDimensions());
    if (divRef.current) resizeObserver.observe(divRef.current);

    updateDimensions(); // Cập nhật ngay khi component mount

    return () => resizeObserver.disconnect();
  }, []);

  // Tính tổng độ dài đường viền ảnh
  const perimeter = (dimensions.width + dimensions.height) * 2;

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
          width={dimensions.width + 10} // Fit với ảnh
          height={dimensions.height + 10} // Fit với ảnh
          viewBox={`0 0 ${dimensions.width + 10} ${dimensions.height + 10}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            top: -5, // Đẩy viền ra ngoài
            left: -5,
          }}
        >
          <motion.rect
            x="5"
            y="5"
            width={dimensions.width}
            height={dimensions.height}
            rx="12"
            stroke="lime"
            strokeWidth="3"
            filter="url(#neon-glow)"
            strokeDasharray={perimeter / 4} // Viền ngắn, tạo hiệu ứng chạy
            strokeDashoffset={perimeter}
            animate={{
              strokeDashoffset: [perimeter, 0], // Di chuyển liên tục
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear", // Chạy đều, không có điểm dừng
            }}
          />

          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feColorMatrix
                result="glow"
                in="blur"
                type="matrix"
                values="0 0 0 0  0
                        0 1 0 0  0
                        0 0 0 0  0
                        0 0 0 0.8 0"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </motion.svg>
      </div>
    </div>
  );
};

export default AnimatedBorderImage;
