export interface TrainingRegisterData {
  title: string;
  time: number;
  icon_url: string | undefined;
  user_id: string | undefined;
  level_id: number;
  visibility_type_id: number;
  club_id: string | undefined;
  items: {
    time: number;
    counting_mode: "time" | "reps";
    reps: number;
    queue: number;
    movement_id: number;
    comments?: string | undefined;
  }[];
}

export interface TrainingsResponse {
  trainings: Training[];
}

export interface Training {
  club_id: string;
  created_at: Date;
  icon_url: string;
  id: string;
  level_id: number;
  time: number;
  title: string;
  training_items: {
    comments: string;
    counting_mode: "time" | "reps";
    movement: {
      average_time: number;
      description: string;
      image_url: string;
      name: string;
      video_url: string;
    };
    queue: number;
    reps: number;
    time: number;
  }[];
  updated_at: Date;
  user: {
    name: string;
    username: string;
  };
  level: {
    title: string;
    description: string;
  };
  user_id: string;
  visibility_type_id: number;
}
