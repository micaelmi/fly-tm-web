import { Movement } from "./training";

export interface StrategyRegisterData {
  title: string;
  how_it_works: string;
  against_whom: string;
  icon_url: string;
  user_id: string;
  level_id: number;
  visibility_type_id: number;
  club_id?: string;
  items: {
    description: string;
    movement_id: number;
  }[];
}

export interface StrategyResponse {
  strategies: Strategy[];
}

export interface StrategyByIdResponse {
  strategy: Strategy;
}

export interface Strategy {
  title: string;
  updated_at: string;
  against_whom: string;
  club_id: string | undefined;
  created_at: string;
  how_it_works: string;
  icon_url: string;
  id: string;
  level_id: number;
  visibility_type_id: number;
  strategy_items: StrategyItem[];
  user: {
    name: string;
    username: string;
    user_id: string;
  };
  level: {
    title: string;
    description: string;
  };
}

export interface StrategyItem {
  description: string;
  movement: Movement;
}
