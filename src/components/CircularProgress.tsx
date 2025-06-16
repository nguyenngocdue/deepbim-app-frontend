
interface CircularProgressProps {
  current: number;
  total: number;
}

export function CircularProgress({ current, total }: CircularProgressProps) {
  const radius = 20;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = total > 0 ? (current / total) * 100 : 0;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-2 text-white">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#2D3748"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="orange"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10"
          fill="white"
        >
          {Math.round(progress)}%
        </text>
      </svg>
      <span className="text-sm text-white">{current}/{total} bài học</span>
    </div>
  );
}
