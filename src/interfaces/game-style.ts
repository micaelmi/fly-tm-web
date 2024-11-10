export interface GameStyle {
  id: number;
  title: string;
  description: string;
}

export interface GameStyleResponse {
  game_styles: GameStyle[];
}
