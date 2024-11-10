export interface HandGrip {
  id: number;
  title: string;
  description: string;
}

export interface HandGripResponse {
  hand_grips: HandGrip[];
}
