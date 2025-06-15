export interface Lesson {
  id: number;
  title: string;
  duration?: string;
  video_url?: string;
}

export interface LessonSection {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}