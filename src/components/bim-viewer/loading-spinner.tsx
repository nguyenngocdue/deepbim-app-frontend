import React, { useEffect, useState } from "react";

const LoadingSpinner: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.random() * 10, 100);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-t-indigo-900 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin [animation-duration:1s]" />
        <div className="absolute inset-1 border-4 border-indigo-100/20 rounded-full" />
      </div>

      {/* Loading Text */}
      <p className="text-xl font-semibold text-indigo-800 mb-4">
        Loading IFC Model...
      </p>

      {/* Progress Bar */}
      <div className="relative w-72 h-4 bg-indigo-100/20 dark:bg-indigo-900/20 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-4 text-lg font-medium text-indigo-900 tracking-wider">
        {Math.round(progress)}%
      </p>
    </div>
  );
};

export default LoadingSpinner;