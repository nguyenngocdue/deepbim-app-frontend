import { Button } from "@/components/ui/button";
import { TutorialCourseCard } from "./TutorialCourseCard";

const courseData = [
  {
    title: "Tự động hóa Revit với Dynamo & Python",
    author: "Nguyễn Ngọc Duệ",
    image: "https://minio.deepbim.net:9000/deepbim-fe/1749736340773-course.jpg",
    avatar: "/images/logo_no_bg.png",
    students: 120,
    views: 45,
    oldPrice: "3,500,000đ",
    newPrice: "3,200,000đ",
    description: "Khóa học chuyên sâu giúp bạn ứng dụng lập trình Python trong Dynamo để tự động hóa quy trình thiết kế và nâng cao hiệu suất làm việc trên Revit. Phù hợp cho kỹ sư, kiến trúc sư và BIMer muốn bứt phá trong kỷ nguyên số.",
    url: "learning/lessons-for-newbies?v=132"
  },
  {
    title: "Xây Dựng Add-in Revit với pyRevit & Python",
    author: "Nguyễn Ngọc Duệ",
    image: "https://minio.deepbim.net:9000/deepbim-fe/1749736340773-course.jpg",
    avatar: "/images/logo_no_bg.png",
    students: 85,
    views: 38,
    oldPrice: "3,000,000đ",
    newPrice: "2,700,000đ",
    description: "Học cách xây dựng công cụ tùy biến cho Revit bằng pyRevit và Python. Khóa học phù hợp cho người làm BIM, kỹ sư, kiến trúc sư muốn tạo plugin riêng, rút ngắn thao tác và tăng hiệu quả công việc."
  },
  {
    title: "Python Căn Bản - Học Làm Chủ Từng Dòng Code",
    author: "Nguyễn Ngọc Duệ",
    image: "https://minio.deepbim.net:9000/deepbim-fe/1749736340773-course.jpg",
    avatar: "/images/logo_no_bg.png",
    students: 160,
    views: 52,
    oldPrice: "1,200,000đ",
    newPrice: "890,000đ",
    description: "Khóa học nền tảng dành cho người mới bắt đầu làm quen với lập trình Python. Giải thích từ căn bản đến thực hành, giúp bạn có nền tảng vững chắc để học tiếp các ứng dụng nâng cao như AI, Web hoặc Revit Automation."
  },
  {
    title: "Phát triển Web Viewer cho Mô hình IFC",
    author: "Nguyễn Ngọc Duệ",
    image: "https://minio.deepbim.net:9000/deepbim-fe/1749736340773-course.jpg",
    avatar: "/assets/avatars/avatar_1.png",
    students: 70,
    views: 35,
    oldPrice: "2,500,000đ",
    newPrice: "2,000,000đ",
    description: "Khóa học hướng dẫn bạn xây dựng trình xem mô hình IFC trên web từ A đến Z, sử dụng các thư viện mã nguồn mở hiện đại như xeokit, three.js. Phù hợp với lập trình viên BIM, kỹ sư phần mềm, hoặc người muốn số hóa mô hình xây dựng."
  }
];

export function TutorialCourseList() {
  return (
    <section className="py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white ">
        Các Khóa Học Vĩnh Viễn 2024
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
        Xuất bản cuối năm 2024. Chất lượng miễn lo, giá cả dễ tiếp cận hơn.
      </p>
      <div className="flex flex-wrap gap-6 justify-center mt-10">
        {courseData.map((course, idx) => (
          <TutorialCourseCard key={idx} {...course} />
        ))}
      </div>
      <div className="mt-6">
        <Button>XEM TẤT CẢ</Button>
      </div>
    </section>
  );
}
