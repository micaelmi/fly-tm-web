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

export interface Strategy {
  against_whom: string;
  club_id: string | null;
  created_at: string;
  how_it_works: string;
  icon_url: string;
  id: string;
  level_id: number;
  strategy_items: {
    description: string;
    movement: {
      average_time: number;
      description: string;
      image_url: string;
      name: string;
      video_url: string;
    };
  };
  title: string;
  updated_at: string;
  user: {
    name: string;
    username: string;
    user_id: string;
  };
  level: {
    title: string;
    description: string;
  };
  visibility_type_id: number;
}
