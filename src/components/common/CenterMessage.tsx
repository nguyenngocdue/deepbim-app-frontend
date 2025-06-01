interface CenterMessageProps {
  text: string;
  className?: string;
}

export function CenterMessage({ text, className = "" }: CenterMessageProps) {
  return (
    <div
      className={`h-full flex justify-center items-center text-gray-400 text-lg font-medium select-none text-center px-4 ${className}`}
    >
      {text}
    </div>
  );
}
