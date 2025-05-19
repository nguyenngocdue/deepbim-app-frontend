import { Badge } from "@/components/ui/badge";

export default function CustomBadge({ text, className = "" }: { text: string, className?: string }) {
  return (
    <Badge className={`rounded-full px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold tracking-wide shadow-sm ${className}`}>
      {text}
    </Badge>
  );
}

