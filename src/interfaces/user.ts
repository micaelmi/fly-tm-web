export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  bio: string | null;
  training_days: number;
  credits: number;
  state: string | null;
  city: string | null;
  instagram: string | null;
  image_url: string | null;
  status: "active" | "inactive";
  user_type_id: number;
  level_id: number | null;
  game_style_id: number | null;
  club_id: number | null;
  hand_grip_id: number | null;
}

export interface UserResponse {
  users: User[];
}

export interface UserRegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}
