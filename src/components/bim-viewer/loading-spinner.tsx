import React, { useEffect, useState } from "react";

const LoadingSpinner: React.FC = () => {
  const [progress, setProgress] = useState(0);

  // Mô phỏng quá trình tải
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Dừng khi đạt 100%
          return 100;
        }
        return prevProgress + Math.random() * 10; // Tăng ngẫu nhiên từ 0-10%
      });
    }, 300); // Cập nhật mỗi 300ms

    return () => clearInterval(interval); // Cleanup khi component unmount
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
      {/* Lớp làm mờ background */}
      <div className="absolute inset-0 backdrop-blur-sm z-[-1]"></div>

      {/* Nội dung chính (spinner, text, progress bar) được bọc trong một div để không bị ảnh hưởng bởi backdrop-blur */}
      <div className="relative flex flex-col items-center justify-center bg-transparent">
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin [animation-duration:1s]"></div>
        </div>

        {/* Text */}
        <p className="text-xl font-semibold text-blue-800  mb-4">
          Loading IFC Model...
        </p>

        {/* Progress Bar */}
        <div className="relative w-64 h-4 bg-blue-100/20 dark:bg-blue-900/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <p className="mt-4 text-lg font-medium text-blue-600 ">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;