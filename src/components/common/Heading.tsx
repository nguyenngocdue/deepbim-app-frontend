import React from "react";
import { cn } from "@/lib/utils";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  position?: "left" | "center" | "right"; // ✅ thêm position
};

export const Heading = ({
  level = 1,
  children,
  className,
  position = "left", // ✅ mặc định left
}: HeadingProps) => {
  const HeadingTag: React.ElementType = `h${level}`;

  const defaultStyles: Record<number, string> = {
    1: "text-4xl font-bold",
    2: "text-3xl font-semibold",
    3: "text-2xl font-semibold",
    4: "text-xl font-medium",
    5: "text-lg font-medium",
    6: "text-base font-medium",
  };

  const positionClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <HeadingTag className={cn(defaultStyles[level], positionClasses[position], className)}>
      {children}
    </HeadingTag>
  );
};
