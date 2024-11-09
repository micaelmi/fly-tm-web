export interface Level {
  id: number;
  title: string;
  description: string;
}

export interface LevelResponse {
  levels: Level[];
}
