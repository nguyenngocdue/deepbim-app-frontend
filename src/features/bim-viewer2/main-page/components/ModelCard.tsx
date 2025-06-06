import { SpinnerOverlay } from "@/components/common/SpinnerOverlay";
import { useState } from "react";

interface ModelCardProps {
  imageUrl: string;
  title: string;
  description: string;
  linkUrl?: string;
}

export default function ModelCard({
  imageUrl,
  title,
  description,
  linkUrl,
}: ModelCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const CardWrapper = linkUrl
    ? (props: any) => (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" {...props} />
      )
    : (props: any) => <div {...props} />;

  return (
    <CardWrapper>
      <div className="relative group rounded-xl overflow-hidden shadow-lg shadow-zinc-500 border border-gray-200 dark:border-zinc-700 transition-all hover:shadow-xl hover:shadow-green-300 dark:hover:shadow-green-900 hover:ring-2 hover:ring-green-400 w-full max-w-full sm:max-w-sm md:max-w-md">
        {/* SpinnerOverlay when loading */}
        <SpinnerOverlay message="Loading model" show={isLoading} />

        {/* Image */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-transparent">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain transition duration-300 ease-in-out group-hover:brightness-110"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end px-3 py-4 sm:px-4 sm:py-5 z-[5]">
          <h3 className="text-white text-base sm:text-lg font-semibold group-hover:text-green-300">
            {title}
          </h3>
         <p className="mt-1 text-xs md:text-sm text-gray-300 group-hover:text-green-200 hidden md:block">
        {description}
      </p>

        </div>
      </div>
    </CardWrapper>
  );
}
