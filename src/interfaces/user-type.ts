export interface UserType {
  id: number;
  description: string;
}

export interface UserTypeResponse {
  user_types: UserType[];
}
