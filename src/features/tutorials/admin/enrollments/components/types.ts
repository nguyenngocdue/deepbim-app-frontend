export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status_id: number;
  created_at: string;
  updated_at: string;

  // Optional relations (nếu bạn include chúng từ API)
  user?: {
    id: number;
    user_name: string;
    email?: string;
    picture?: string;
  };

  course?: {
    id: number;
    title: string;
  };

  status?: {
    id: number;
    type: string;
    code: string;
    label: string;
    class_name?: string;
  };
}

// Dùng cho select options trong form (status, user, course, etc.)
export interface FormOption {
  label: string;
  value: string | number | boolean;
}

export type Mode = "create" | "edit" | "view" | null;
