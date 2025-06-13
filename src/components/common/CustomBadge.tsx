import { Badge } from "@/components/ui/badge";

export default function CustomBadge({ text, className = "" }: { text: string, className?: string }) {
  return (
    <Badge className={`bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-700/90 hover:to-purple-700/90 dark:bg-gradient-to-r dark:from-slate-700/80 dark:to-slate-600/80 dark:hover:from-slate-800/90 dark:hover:to-slate-700/90 rounded-none  text-white text-xs font-medium tracking-wide shadow-md transition-all duration-200 ${className}`}>
      {text}
    </Badge>
  );
}