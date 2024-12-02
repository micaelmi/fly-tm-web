export interface GameStyle {
  id: number;
  title: string;
  description: string;
}

export interface GameStyleResponse {
  gameStyles: GameStyle[];
}
