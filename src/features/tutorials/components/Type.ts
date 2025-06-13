export interface CourseCardProps {
  title: string;
  author: string;
  image: string;
  avatar: string;
  students: number;
  views: number;
  oldPrice: string;
  newPrice: string;
  description?: string;
  url?: string; 
}
