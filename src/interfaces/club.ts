import { User } from "./user";

export interface ClubRegisterData {
  name: string;
  description: string;
  logo_url: string;
  background: string;
  owner_username: string;
  email: string;
  phone: string | undefined;
  instagram: string | undefined;
  other_contacts: string | undefined;
  schedule: string;
  prices: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  address_number: number | undefined;
  complement: string | undefined;
  maps_url: string | undefined;
  max_members: number;
}

export interface Club extends ClubRegisterData {
  id: string;
  created_at: string;
  updated_at: string;
  _count: {
    users: number;
  };
  users: User[];
}

export interface ClubsResponse {
  clubs: Club[];
}

export interface ClubResponse {
  club: Club;
}
