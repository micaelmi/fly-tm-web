export interface Movement {
  id: number;
  name: string;
  description: string;
  average_time: number;
  video_url: string;
  image_url: string;
}

export interface MovementResponse {
  movement: Movement;
}

export interface MovementsResponse {
  movements: Movement[];
}
