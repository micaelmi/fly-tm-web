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
  user_type: {
    id: number;
    description: string;
  };
  level_id: number | null;
  level: {
    id: number;
    title: string;
    description: string;
  };
  game_style_id: number | null;
  game_style: {
    id: number;
    title: string;
    description: string;
  };
  club_id: number | null;
  club: {
    id: string;
    name: string;
    description: string;
    logo_url: string;
  };
  hand_grip_id: number | null;
  hand_grip: {
    id: number;
    title: string;
    description: string;
  };
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
