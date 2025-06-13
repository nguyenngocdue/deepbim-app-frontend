import { Card, CardContent } from "@/components/ui/card";

export default function CourseOverviewTab() {
  return (
    <Card className="bg-gradient-to-br from-gray-900/90 via-indigo-900/80 to-purple-900/80  text-white overflow-hidden transition-all duration-300 hover:shadow-3xl">
      {/* Giới thiệu tổng quan */}
      <CardContent className="p-6 pt-8 space-y-6">
        <h2 className="text-2xl font-bold text-green-400 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent animate-pulse-slow">
          Giới Thiệu Khóa Học
        </h2>
        <p className="text-lg leading-relaxed text-gray-200 bg-gray-800/50 p-4 rounded-lg shadow-inner transition-opacity duration-300 hover:opacity-90">
          Khóa học <strong className="text-emerald-300">Ứng Dụng Dynamo và Python vào Revit</strong> cung cấp hơn <strong className="text-emerald-300">150+ bài học</strong> từ cơ bản đến nâng cao, giúp tối ưu hóa quy trình làm việc. 
          Phù hợp cho mọi đối tượng, từ người mới bắt đầu với BIM đến kỹ sư Revit muốn tăng tốc hiệu suất và tự động hóa công việc.
        </p>
      </CardContent>

      {/* Đối tượng phù hợp */}
      <CardContent className="p-6 space-y-6 bg-gray-800/60 border-t border-gray-700/40">
        <h3 className="text-xl font-semibold text-green-400 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Khóa Học Dành Cho Ai?
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
          <li className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-all duration-200 transform hover:scale-105">
            <span className="text-emerald-300">✔</span> Người mới bắt đầu với BIM và Revit
          </li>
          <li className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-all duration-200 transform hover:scale-105">
            <span className="text-emerald-300">✔</span> Kỹ sư Revit muốn cải thiện hiệu quả công việc
          </li>
          <li className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-all duration-200 transform hover:scale-105">
            <span className="text-emerald-300">✔</span> Chuyên gia xây dựng tìm kiếm tự động hóa quy trình
          </li>
          <li className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-all duration-200 transform hover:scale-105">
            <span className="text-emerald-300">✔</span> Nhà phát triển muốn tích hợp Python với Dynamo
          </li>
          <li className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-all duration-200 transform hover:scale-105">
            <span className="text-emerald-300">✔</span> Những ai muốn nâng cao kỹ năng trong thiết kế BIM
          </li>
        </ul>
      </CardContent>

      {/* Yêu cầu tiên quyết */}
      <CardContent className="p-6 space-y-6 bg-gray-800/40 border-t border-gray-700/40">
        <h3 className="text-xl font-semibold text-green-400 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Yêu Cầu Tiên Quyết
        </h3>
        <p className="text-base text-gray-200 bg-gray-700/50 p-4 rounded-lg shadow-inner transition-opacity duration-300 hover:opacity-90">
          Không cần kinh nghiệm lập trình trước. Chỉ cần kiến thức cơ bản về Revit và tinh thần học hỏi để làm chủ Dynamo và Python!
        </p>
      </CardContent>
    </Card>
  );
}