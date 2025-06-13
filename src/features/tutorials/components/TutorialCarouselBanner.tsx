import { useState, useEffect } from "react";
import { CourseHeader } from "@/features/courses/components/CourseHeader";

export function TutorialSearchBanner() {
  const [api, setApi] = useState<any>(null);

const banners = [
  {
    title: "Học Lập Trình Tại DeepBIM",
    desc: "DeepBIM là nơi đào tạo bài bản về lập trình, từ cơ bản đến nâng cao. Học viên được thực chiến với dự án thật và mentor kèm sát.",
    button: "KHÁM PHÁ KHÓA HỌC",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Java Từ A đến Z",
    desc: "Khóa học Java toàn diện, phù hợp từ người mới bắt đầu đến người đã đi làm muốn nâng cấp kỹ năng backend & hệ thống.",
    button: "XEM NGAY",
    gradient: "from-yellow-500 to-red-500",
  },
  {
    title: "Frontend Mastery",
    desc: "Thành thạo HTML, CSS, JavaScript, React và hơn thế nữa. Cập nhật công nghệ UI/UX mới nhất.",
    button: "BẮT ĐẦU NGAY",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    title: "Thực chiến với dự án thật",
    desc: "Không chỉ học lý thuyết. DeepBIM giúp bạn áp dụng kiến thức vào thực tế qua các mini project và real-case.",
    button: "THAM GIA NGAY",
    gradient: "from-emerald-500 to-lime-500",
  },
];


  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [api]);

  return (
      <CourseHeader banners={banners} />
  );
}