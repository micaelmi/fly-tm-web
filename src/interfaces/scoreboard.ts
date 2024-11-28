export interface MatchRegisterData {
  player1: string;
  player2: string;
  better_of: number;
  user_id: string;
}

export interface Match extends MatchRegisterData {
  id: string;
  date: string;
  sets_player1: number;
  sets_player2: number;
  games_history: {
    id: number;
    points_player1: number;
    points_player2: number;
    game_number: number;
    created_at: string;
    updated_at: string;
  }[];
}

export interface MatchesResponse {
  matches: Match[];
}

export interface MatchResponse {
  match: Match;
}

export interface GameRegisterData {
  points_player1: number;
  points_player2: number;
  game_number: number;
  match_history_id: string;
}

export interface Game extends GameRegisterData {
  id: number;
  created_at: string;
  updated_at: string;
}
