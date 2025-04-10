import React from "react";

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Hexagon Loader */}
      <div className="relative w-32 h-32">
        {/* Outer Circle */}
        <div className="absolute inset-0 m-auto w-full h-full rounded-full border-4 border-blue-500/50 animate-spin-slow"></div>
        {/* Middle Circle */}
        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full border-4 border-purple-500/50 animate-spin-medium"></div>
        {/* Inner Circle */}
        <div className="absolute inset-0 m-auto w-16 h-16 rounded-full border-4 border-green-500/50 animate-spin-fast"></div>
        {/* Center Dot */}
        <div className="absolute inset-0 m-auto w-4 h-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;