import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

type BadgeType = "dev" | "new";

interface CustomBadgeProps {
  text: string;
  type?: BadgeType;
  className?: string;
}

export default function CustomBadge({
  text,
  type = "dev",
  className = "",
}: CustomBadgeProps) {
  const baseStyle = "text-white text-xs font-medium tracking-wide shadow-md transition-all duration-200";

  const typeClass = {
    dev: "bg-yellow-400",
    new: "bg-green-600",
  };

  return (
    <Badge className={clsx(baseStyle, typeClass[type], className)}>
      {text}
    </Badge>
  );
}
