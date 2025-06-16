import { ReactNode } from "react";

interface PromptCardProps {
  imageUrl?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PromptCard({
  imageUrl = "https://minio.deepbim.net:9000/deepbim-fe/1749532142227-website-maintenance.png",
  title,
  description,
  action,
}: PromptCardProps) {
  return (
    <div className="w-[95%] max-w-[32rem] mx-auto text-center p-3 sm:p-4 rounded-2xl bg-muted/10 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center gap-2 sm:gap-3">
      {/* Logo */}
      <div className="flex flex-col items-center gap-1">
        <img
          src="https://minio.deepbim.net:9000/deepbim-fe/1749531131956-logo_no_bg.png"
          alt="DeepBIM Logo"
          className="max-w-[min(15%,4rem)] sm:max-w-[min(15%,5rem)] h-auto object-contain animate-soft-bounce"
        />
        <span className="text-[clamp(1rem,3.5vw,1.25rem)] sm:text-[clamp(1.25rem,4vw,1.5rem)] font-medium tracking-tight text-foreground">
          DeepBIM
        </span>
      </div>

      {/* Illustration - Hidden on small screens */}
      <div className="hidden sm:flex w-full justify-center">
        <img
          src={imageUrl}
          alt={`${title} Illustration`}
          className="max-w-[min(50%,10rem)] max-h-[min(30%,8rem)] object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-[clamp(0.875rem,2.5vw,1rem)] sm:text-[clamp(1rem,3vw,1.25rem)] font-semibold text-foreground">
          {title}
        </h1>
        <p className="text-[clamp(0.75rem,2vw,0.875rem)] text-muted-foreground leading-relaxed max-w-[90%]">
          {description}
        </p>
        {action && <div className="mt-2 animate-soft-bounce">{action}</div>}
      </div>
    </div>
  );
}