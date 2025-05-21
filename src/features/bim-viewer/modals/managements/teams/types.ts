export type TeamMember = {
  user: {
    id: number;
    user_name?: string;
    name?: string;
    picture?: string;
  };
};

export type Team = {
  id: number;
  name?: string;
  description?: string;
  sub_project_id?: number;
  avatar?: string;
  members?: TeamMember[];
  avatar_temp?: string;
};