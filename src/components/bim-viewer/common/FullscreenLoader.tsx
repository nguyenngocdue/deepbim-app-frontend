"use client";

import CircularProgress from "@/components/ui/circular-progress";
import * as React from "react";

interface FullscreenLoaderProps {
  progress?: number;
  showLabel?: boolean;
  message?: string;
  size?: number;
}

const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({
  progress = 0,
  showLabel = true,
  message = "Getting things ready...",
  size = 200,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm space-y-4">
      <CircularProgress
        value={progress}
        size={size}
        strokeWidth={10}
        showLabel={showLabel}
      />

      {message && (
        <p className="text-white text-sm tracking-wide opacity-80">{message}</p>
      )}
    </div>
  );
};

export default FullscreenLoader;
