// Một bài học đơn lẻ
export interface Lesson {
  id: number;
  title: string;
  duration: string;       // Ví dụ: "5 phút", "12:30", "10 min"
  isLocked: boolean;      // true nếu khóa
}

// Một mục section chứa nhiều bài học
export interface Section {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type LessonSection = Section[];