export interface HandGrip {
  id: number;
  title: string;
  description: string;
}

export interface HandGripResponse {
  handGrips: HandGrip[];
}
