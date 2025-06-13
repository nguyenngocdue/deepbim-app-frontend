import { Button } from "@/components/ui/button";

export default function CourseHeader() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 p-6 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 rounded-2xl shadow-xl">
      <img
        src="https://minio.deepbim.net:9000/deepbim-fe/dynamo-2025-all-new.png"
        alt="Course Banner"
        className="rounded-xl w-full lg:w-[400px] h-[240px] object-cover shadow-md transition-transform hover:scale-105"
      />
      <div className="flex-1 space-y-4 text-white">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Dynamo Từ Cơ Bản Đến Nâng Cao 2025
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Giáo viên: <span className="font-semibold">Nguyễn Ngọc Duệ</span> • Phân loại: Dynamo, BIM, 2025
        </p>
      </div>
    </div>
  );
}