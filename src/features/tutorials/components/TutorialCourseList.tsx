import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TutorialCourseCard } from "./TutorialCourseCard";
import { getCourses } from "@/apis/course-api";

type Course = {
  id: string | number;
  title: string;
  thumbnail_url: string;
  students_count?: number;
  views?: number;
  old_price?: number;
  new_price?: number;
  description: string;
};

export function TutorialCourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCourses(); 
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };
    fetchData();
  }, []);

  console.log(courses)


  return (
    <section className="py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white ">
        Các Khóa Học Vĩnh Viễn 2024
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
        Xuất bản cuối năm 2024. Chất lượng miễn lo, giá cả dễ tiếp cận hơn.
      </p>

    <div className="flex flex-wrap gap-6 justify-center mt-10">
        {courses.map((course, idx) => (
          <TutorialCourseCard
            key={idx}
            title={course.title}
            author="Nguyễn Ngọc Duệ"
            image={course.thumbnail_url}
            avatar="/images/logo_no_bg.png"
            students={course.students_count || 0}
            views={course.views || 0}
            oldPrice={`${(course.old_price || 0).toLocaleString("vi-VN")}đ`}
            newPrice={`${(course.new_price || 0).toLocaleString("vi-VN")}đ`}
            description={course.description}
            url={`/learning/lessons/${course.id}`}
            statusLabel={course.status?.name}
            statusClassName={course.status?.class_name}
          />
        ))}
      </div>


      <div className="mt-6">
        <Button>XEM TẤT CẢ</Button>
      </div>
    </section>
  );
}
