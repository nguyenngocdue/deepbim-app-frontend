import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ModelCardProps {
  imageUrls: string[];
  title: string;
  description: string;
  linkUrl?: string;
  tags?: string[];
}

export default function ModelCard({
  imageUrls,
  title,
  description,
  linkUrl,
  tags = [],
}: ModelCardProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const rotateImage = () => {
      setIndex((prev) => (prev + 1) % imageUrls.length);
      const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2–5s
      timeout = setTimeout(rotateImage, randomDelay);
    };

    rotateImage();

    return () => clearTimeout(timeout);
  }, [imageUrls]);

  const CardWrapper = linkUrl
    ? (props: any) => (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          {...props}
        />
      )
    : (props: any) => <div {...props} />;

  return (
    <CardWrapper>
      <div className="relative group rounded-xl overflow-hidden shadow-md shadow-zinc-400 border border-zinc-200 dark:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-green-300 dark:hover:shadow-green-800 hover:ring-2 hover:ring-green-400 w-full">
        {/* Image Carousel */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-transparent relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={imageUrls[index]}
              src={imageUrls[index]}
              alt={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
              className="w-full h-full object-contain absolute inset-0"
            />
          </AnimatePresence>
        </div>

        {/* Overlay */}
<div
  className="absolute inset-0 bg-gradient-to-t
    from-white/40 via-white/10 to-transparent
    dark:from-black/70 dark:via-black/30 dark:to-transparent
    flex flex-col justify-end px-3 py-4 sm:px-4 sm:py-5 z-[5]"
>
          <h3 className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-semibold group-hover:text-green-600 dark:group-hover:text-green-300">
            {title}
          </h3>
          <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-300 group-hover:text-green-700 dark:group-hover:text-green-200 hidden md:block">
            {description}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 text-xs rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}
