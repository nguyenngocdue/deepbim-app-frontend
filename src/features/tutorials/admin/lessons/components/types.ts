export interface Lesson {
  id: number;
  name: string;
  description: string;
  title: string;
  old_price: number;
  new_price: number;
  is_free: boolean;
  students_count: number;
  updated_at: string;
  owner_id?: number;
  status_id?: number;
  owner?: { id: number; user_name: string; picture?: string; email?: string };
  status?: { id: number; name: string; class_name: string };
}

export interface FormOption {
  label: string;
  value: string;
}