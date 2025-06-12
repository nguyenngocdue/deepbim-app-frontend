import { Badge } from "@/components/ui/badge";

export default function CustomBadge({ text, className = "" }: { text: string, className?: string }) {
  return (
    <Badge  className={`hover:bg-gray-600 dark:bg-slate-500 rounded-full px-2 py-0.5 text-white text-xs font-semibold tracking-wide shadow-sm ${className}`}>
      {text}
    </Badge>
  );
}

