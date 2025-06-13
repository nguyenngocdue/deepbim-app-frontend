import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  BarChart2, 
  Globe, 
  Users, 
  Award, 
  CheckSquare, 
  Heart 
} from "lucide-react";

interface CourseInfoSidebarProps {
  info: {
    totalLessons: number;
    quizzes: number;
    duration: string;
    level: string;
    language: string;
    students: number;
    certificate: boolean;
    assessment: boolean;
  };
}

export default function CourseInfoSidebar({ info }: CourseInfoSidebarProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800 border border-gray-700/60 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="bg-gray-800/50 p-6 pb-4 border-b border-gray-700/40">
        <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-emerald-500" />
          Thông Tin Khóa Học
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-5">
        <ul className="space-y-4 text-sm text-gray-300">
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Số bài học:</span>
            <span className="font-semibold text-gray-100">{info.totalLessons}</span>
          </li>
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <CheckSquare className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Quiz:</span>
            <span className="font-semibold text-gray-100">{info.quizzes}</span>
          </li>
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Thời lượng:</span>
            <span className="font-semibold text-gray-100">{info.duration}</span>
          </li>
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <BarChart2 className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Cấp độ:</span>
            <span className="font-semibold text-gray-100">{info.level}</span>
          </li>
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <Globe className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Ngôn ngữ:</span>
            <span className="font-semibold text-gray-100">{info.language}</span>
          </li>
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Học viên:</span>
            <span className="font-semibold text-gray-100">{info.students}</span>
          </li>
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <Award className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Chứng nhận:</span>
            <span className="font-semibold text-gray-100">{info.certificate ? "Có" : "Không"}</span>
          </li>
          <li className="flex items-center gap-3 hover:text-gray-100 transition-colors duration-200">
            <CheckSquare className="h-5 w-5 text-blue-400" />
            <span className="font-medium">Assessments:</span>
            <span className="font-semibold text-gray-100">{info.assessment ? "Có" : "Không"}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}