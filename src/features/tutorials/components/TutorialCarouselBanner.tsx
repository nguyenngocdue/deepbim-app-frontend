import { useState, useEffect } from "react";
import { Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function TutorialSearchBanner() {
  const [api, setApi] = useState<any>(null);

  const banners = [
    {
      title: "Học ReactJS Miễn Phí!",
      desc: "Khóa học ReactJS từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.",
      button: "ĐĂNG KÝ NGAY",
      img: "https://cdn-icons-png.flaticon.com/512/919/919851.png",
      gradient: "from-blue-500 to-violet-600",
    },
    {
      title: "Lớp Offline tại Hà Nội 👑",
      desc: "Hình thức học Offline phù hợp nếu bạn muốn được hướng dẫn và hỗ trợ trực tiếp tại lớp. Giờ học linh hoạt, phù hợp cả sinh viên và người đi làm.",
      button: "TƯ VẤN MIỄN PHÍ",
      img: "/mnt/data/644b6cab-735e-49c5-8ac0-d376d193ce90.png",
      gradient: "from-sky-600 to-cyan-400",
    },
  ];

  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 5000); // Auto slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      className="w-full max-w-screen-xl mx-auto relative"
    >
      <CarouselContent>
        {banners.map((banner, idx) => (
          <CarouselItem key={idx} className="p-2">
            <section className={`flex flex-col sm:flex-row bg-gradient-to-r ${banner.gradient} text-white rounded-2xl overflow-hidden p-4 sm:p-6 max-h-96 h-full items-center justify-between gap-4 sm:gap-6`}>
              <div className="sm:max-w-md text-left flex-shrink-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight line-clamp-2">
                  {banner.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {banner.desc}
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-white text-white hover:bg-white hover:text-black"
                >
                  {banner.button}
                </Button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="w-full max-w-xs sm:max-w-md object-contain rounded-lg shadow-lg"
                />
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
      <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
    </Carousel>
  );
}