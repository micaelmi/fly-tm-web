import { Club } from "./club";
import { GameStyle } from "./game-style";
import { HandGrip } from "./hand-grip";
import { Level } from "./level";
import { UserType } from "./user-type";

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
  credits?: number;
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
  club_id: string | null;
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
  _count: {
    events: number;
    contacts: number;
  };
}

export interface UserByUsernameApiResponse {
  user: Partial<UserByUsername>;
}

export interface UserByUsername {
  bio: string;
  city: string;
  club: Partial<Club>;
  created_at: string;
  credits: number;
  email: string;
  game_style: GameStyle;
  hand_grip: HandGrip;
  id: string;
  image_url: string;
  instagram: string;
  level: Level;
  name: string;
  state: string;
  training_days: number;
  user_type: UserType;
  username: string;
  _count: {
    events: number;
  };
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface UserRegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserData {
  user: User;
}
