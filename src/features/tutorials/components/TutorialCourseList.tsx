import { Button } from "@/components/ui/button";
import { TutorialCourseCard } from "./TutorialCourseCard";

const courseData = [
  {
    title: "SQL từ cơ bản đến nâng cao (Vĩnh viễn)",
    author: "Thân Triệu",
    image: "https://minio.deepbim.net:9000/deepbim-fe/1749736340773-course.jpg",
    avatar: "https://i.pravatar.cc/40?img=1",
    students: 209,
    views: 61,
    oldPrice: "1,499,000đ",
    newPrice: "399,000đ",
  },
  {
    title: "Lập trình C++ OOP từ A đến Z",
    author: "Thân Triệu",
    image: "https://minio.deepbim.net:9000/deepbim-fe/1749736340773-course.jpg",
    avatar: "https://i.pravatar.cc/40?img=2",
    students: 322,
    views: 112,
    oldPrice: "1,699,000đ",
    newPrice: "499,000đ",
  },
  {
    title: "React & TypeScript Cơ Bản",
    author: "Thân Triệu",
    image: "https://minio.deepbim.net:9000/deepbim-fe/1749736340773-course.jpg",
    avatar: "https://i.pravatar.cc/40?img=3",
    students: 175,
    views: 97,
    oldPrice: "1,299,000đ",
    newPrice: "299,000đ",
  },
];
export function TutorialCourseList() {
  return (
    <section className="py-10 px-4">
      <h2 className="text-2xl font-bold mb-2">Các khóa học Vĩnh Viễn 2024</h2>
      <p className="mb-4">Xuất bản cuối năm 2024. Chất lượng miễn lo giá cả dễ tiếp cận hơn.</p>
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
