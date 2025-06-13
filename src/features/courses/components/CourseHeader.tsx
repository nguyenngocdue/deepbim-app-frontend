import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Banner {
  title: string;
  desc: string;
  button: string;
  gradient: string;
}

interface CourseHeaderProps {
  banners: Banner[];
}

export function CourseHeader({ banners }: CourseHeaderProps) {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [api]);

  return (
    <div className="p-2">
      <Carousel setApi={setApi} className="mx-auto relative">
        <CarouselContent className="">
          {banners.map((banner, idx) => (
            <CarouselItem key={idx} className="flex justify-center">
              <section
                className={`w-full bg-gradient-to-br ${banner.gradient} text-white rounded-xl p-3 sm:p-6 space-y-3 sm:space-y-4 min-h-[180px] sm:min-h-[220px] flex flex-col justify-between shadow-lg`}
              >
                <div className="flex-grow">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{banner.title}</h2>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 line-clamp-3">{banner.desc}</p>
                </div>
                <div className="text-center">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-black rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    {banner.button}
                  </Button>
                </div>
              </section>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Ẩn nút chuyển slide trên mobile */}
        <CarouselPrevious className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10" />
        <CarouselNext className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10" />
      </Carousel>
    </div>
  );
}