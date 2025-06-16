import { cn } from "@/lib/utils";

interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  className?: string;
}

export function CircularProgress({
  current,
  total,
  size = 40,
  className,
}: CircularProgressProps) {
  const radius = size / 2;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = total > 0 ? (current / total) * 100 : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg height={size} width={size}>
        {/* Nền vòng ngoài – dùng màu xám rõ ràng hơn */}
        <circle
          className="stroke-gray-300 dark:stroke-muted"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Vòng tiến độ – vẫn dùng màu primary */}
        <circle
          className="stroke-primary"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size / 4}
          className="fill-foreground"
        >
          {Math.round(progress)}%
        </text>
      </svg>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {current}/{total} bài học
      </span>
    </div>
  );
}
