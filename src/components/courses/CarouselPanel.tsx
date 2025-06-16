import { useState, useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// CarouselPanel Component
interface CarouselPanelProps {
  items: any[];
  renderItem?: (item: any, index: number) => React.ReactNode;
  renderImage?: (item: any, index: number) => React.ReactNode;
  autoplayInterval?: number;
  showNavigation?: boolean;
  className?: string;
  itemClassName?: string;
}

export function CarouselPanel({
  items,
  renderItem,
  renderImage,
  autoplayInterval = 5000,
  showNavigation = true,
  className = "",
  itemClassName = "",
}: CarouselPanelProps) {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (api && autoplayInterval > 0) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [api, autoplayInterval]);

  // Default renderImage function
  const defaultRenderImage = (item: any, index: number) => (
    <img
      src={item.src || item}
      alt={item.alt || `Carousel item ${index + 1}`}
      className="w-full h-auto object-cover rounded-lg"
    />
  );

  // Use renderImage if provided, otherwise fall back to renderItem or defaultRenderImage
  const renderContent = (item: any, index: number) => {
    if (renderImage) {
      return renderImage(item, index);
    }
    if (renderItem) {
      return renderItem(item, index);
    }
    return defaultRenderImage(item, index);
  };

  return (
    <div className={`p-2 ${className}`}>
      <Carousel setApi={setApi} className="mx-auto relative">
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className={`flex justify-center ${itemClassName}`}>
              {renderContent(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
        {showNavigation && (
          <>
            <CarouselPrevious className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10" />
            <CarouselNext className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10" />
          </>
        )}
      </Carousel>
    </div>
  );
}