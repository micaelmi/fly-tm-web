export interface EventRegisterData {
  name: string;
  start_date: string;
  end_date: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  address_number: number;
  maps_url: string | undefined;
  description: string;
  image_url: string | undefined;
  status: "active" | "inactive";
  complement: string;
  level_id: number;
  price: string;
  user_id: string | undefined;
}

export interface Event {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  address_number: number;
  maps_url: string;
  description: string;
  image_url: string | undefined;
  status: "active" | "inactive";
  complement: string;
  level_id: number;
  level: {
    title: string;
    description: string;
  };
  user_id: string | undefined;
  user: {
    username: string;
  };
  price: string;
}

export interface EventResponse {
  events: Event[];
}
