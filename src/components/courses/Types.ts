// Một bài học đơn lẻ
export interface Lesson {
  id: number;
  title: string;
  duration: string;      
  is_locked: boolean;      
}


export interface Section {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type LessonSection = Section[];