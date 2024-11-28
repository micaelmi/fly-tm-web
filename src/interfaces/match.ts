export interface Match {
  games: number;
  player1: {
    name: string;
    games: number;
    points: number[];
  };
  player2: {
    name: string;
    games: number;
    points: number[];
  };
  firstService: number;
  datetime: Date;
}
