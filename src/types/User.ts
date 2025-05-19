export interface SocialMedia {
  name: string;
  link: string;
}

export interface UserProfile {
  id: number;
  user_name: string | null;  
  full_name: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  picture: string | null;
  birthday: string | null;
  created_at: string;
  updated_at: string;
  nick_name?: string | null;
  bio?: string | null;
  social_media?: SocialMedia[] | null;
  is_verified?: boolean;
}
