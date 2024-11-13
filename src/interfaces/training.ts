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
