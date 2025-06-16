import { Card, CardContent } from "@/components/ui/card";

export default function CourseOverviewTab() {
  return (
    <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Giới thiệu tổng quan */}
      <CardContent className="p-6 pt-8 space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          Giới Thiệu Khóa Học
        </h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700">
          Khóa học <strong className="text-blue-500 dark:text-emerald-400">Ứng Dụng Dynamo và Python vào Revit</strong> cung cấp hơn <strong className="text-blue-500 dark:text-emerald-400">150+ bài học</strong> từ cơ bản đến nâng cao, giúp tối ưu hóa quy trình làm việc. 
          Phù hợp cho mọi đối tượng, từ người mới bắt đầu với BIM đến kỹ sư Revit muốn tăng tốc hiệu suất và tự động hóa công việc.
        </p>
      </CardContent>

      {/* Đối tượng phù hợp */}
      <CardContent className="p-6 space-y-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          Khóa Học Dành Cho Ai?
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-101">
            <span className="text-emerald-500 dark:text-emerald-400">✔</span> Người mới bắt đầu với BIM và Revit
          </li>
          <li className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-101">
            <span className="text-emerald-500 dark:text-emerald-400">✔</span> Kỹ sư Revit muốn cải thiện hiệu quả công việc
          </li>
          <li className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-101">
            <span className="text-emerald-500 dark:text-emerald-400">✔</span> Chuyên gia xây dựng tìm kiếm tự động hóa quy trình
          </li>
          <li className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-101">
            <span className="text-emerald-500 dark:text-emerald-400">✔</span> Nhà phát triển muốn tích hợp Python với Dynamo
          </li>
          <li className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-101">
            <span className="text-emerald-500 dark:text-emerald-400">✔</span> Những ai muốn nâng cao kỹ năng trong thiết kế BIM
          </li>
        </ul>
      </CardContent>

      {/* Yêu cầu tiên quyết */}
      <CardContent className="p-6 space-y-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          Yêu Cầu Tiên Quyết
        </h3>
        <p className="text-base text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 p-4 rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-600">
          Không cần kinh nghiệm lập trình trước. Chỉ cần kiến thức cơ bản về Revit và tinh thần học hỏi để làm chủ Dynamo và Python!
        </p>
      </CardContent>
    </Card>
  );
}