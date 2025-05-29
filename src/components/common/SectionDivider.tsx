interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={`h-px mb-5 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-zinc-700 ${className}`}/>
  );
}
