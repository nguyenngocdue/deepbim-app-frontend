import { FaBookOpen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { CarouselPanel } from "@/components/courses/CarouselPanel";
import { useLocation } from "@tanstack/react-router";
import { Banner } from "./Type";

// WelcomeLessonMessage Component


export function WelcomeLessonMessage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("course_id");

  const banners: Banner[] = [
       {
      title: "Khám Phá Dynamo Cho Revit",
      desc: "Học cách sử dụng Dynamo để tự động hóa quy trình Revit với Python. Áp dụng kinh nghiệm thực tế từ các dự án Kết Cấu & Kiến Trúc.",
      button: "BẮT ĐẦU HỌC",
      link: `${import.meta.env.VITE_BASE_URL}/tutorials/learning/lessons-for-newbies/?course_id=${courseId}`,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Tài Liệu Dynamo Primer",
      desc: "Nắm vững nền tảng Dynamo với tài liệu chính thức Dynamo Primer. Hiểu tổng quan mà không cần mất thời gian nghiên cứu từ đầu.",
      button: "XEM TÀI LIỆU",
      gradient: "from-purple-500 to-indigo-500",
      link: "https://primer.dynamobim.org/",
    },
    {
      title: "Python Trong Dynamo",
      desc: "Tự thiết kế các Node tùy chỉnh bằng Python, tận dụng Revit API để tăng tốc quy trình làm việc và tối ưu hóa dự án.",
      button: "KHÁM PHÁ PYTHON",
      gradient: "from-yellow-500 to-red-500",
      link: "https://www.youtube.com/watch?v=cWZWmbq2Kho&list=PLAw0jKncEcw63LYBKv9hgFuoiEqezrGcd",
    },
    {
      title: "Thư Viện Dynamo Packages",
      desc: "Tải về các package Dynamo mạnh mẽ để nâng cao hiệu suất làm việc. Tối ưu hóa scripts, giảm sự phức tạp trong dự án.",
      button: "TẢI PACKAGES",
      gradient: "from-emerald-500 to-lime-500",
      link: "https://dynamopackages.com/",
    },
    {
      title: "Viết Add-in Revit Bằng Python",
      desc: "Học cách tạo Add-in Revit chuyên nghiệp bằng Python, tương tự như C#, để tối ưu hóa quy trình làm việc của bạn.",
      button: "TÌM HIỂU THÊM",
      gradient: "from-teal-500 to-green-500",
      link: "#",
    },
    {
      title: "Kết Nối Với Cộng Đồng",
      desc: "Tham gia nhóm Zalo để nhận chia sẻ kinh nghiệm, cập nhật ý tưởng mới, và hỗ trợ từ các chuyên gia Dynamo & Revit.",
      button: "THAM GIA ZALO",
      gradient: "from-pink-500 to-rose-500",
      link: "https://zalo.me/g/gbddcw235", // Replace with actual Zalo group link
    },
  ];

const renderBanner = (banner: Banner, idx: number) => (
    <section
      className={`w-full bg-gradient-to-br ${banner.gradient} text-white rounded-xl p-3 sm:p-6 space-y-3 sm:space-y-4 min-h-[180px] sm:min-h-[220px] flex flex-col justify-between shadow-lg`}
    >
      <div className="flex-grow">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{banner.title}</h2>
        <p className="text-xs sm:text-sm leading-relaxed opacity-90 line-clamp-3">{banner.desc}</p>
      </div>
      {
        banner.button && 
        <div className="text-center">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm w-full sm:w-auto"
            asChild
          >
            <a href={banner.link} target="_blank" rel="noopener noreferrer">
              {banner.button}
            </a>
          </Button>
        </div>
      }
    </section>
  );
  
  return (
    <div className=" mx-auto py-8 px-4 sm:px-6 flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl shadow-lg border dark:border-gray-600 border-gray-400">
      {/* Welcome Header with Icon */}
      <div className="flex flex-col items-center text-center">
        <FaBookOpen className="text-4xl sm:text-5xl text-blue-400 mb-4 transition-transform hover:scale-110" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Chào mừng bạn đến với khóa học!</h2>
        <p className="text-gray-300 text-sm sm:text-base max-w-xl">
          Hãy chọn một bài học từ danh sách bên phải để bắt đầu. Chúng tôi rất vui khi bạn tham gia và hy vọng bạn sẽ học được thật nhiều điều bổ ích.
        </p>
      </div>

      {/* Carousel Panel */}
      <CarouselPanel
        items={banners}
        renderItem={renderBanner}
        autoplayInterval={5000}
        showNavigation={true}
        className="w-full"
      />
    </div>
  );
}