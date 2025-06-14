import { Badge } from "@/components/ui/badge";

export default function CustomBadge({ text, className = "" }: { text: string, className?: string }) {
  return (
    <Badge className={` text-white text-xs font-medium tracking-wide shadow-md transition-all duration-200 ${className}`}>
      {text}
    </Badge>
  );
}