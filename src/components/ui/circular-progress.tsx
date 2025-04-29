"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CircularProgressProps {
  value: number;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: "square" | "round";
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel = true,
  shape = "round",
  size = 100,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
}) => {
  const radius = size / 2 - circleStrokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Base circle - nền */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#2c2c2c"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          className={className}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#ffffff"
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap={shape}
          className={progressClassName}
        />
      </svg>

      {/* Label */}
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-white font-bold text-xl",
            labelClassName
          )}
        >
          {renderLabel ? renderLabel(value) : `${value}%`}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
