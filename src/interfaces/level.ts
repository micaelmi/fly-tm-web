export interface Level {
  id: number;
  title: string;
  description: string;
}

export interface LevelResponse {
  levels: Level[];
}

export interface ComboboxItem {
  value: number | undefined;
  label: string | undefined;
}

export interface ComboboxOption {
  id: number;
  title: string;
  description: string;
}
