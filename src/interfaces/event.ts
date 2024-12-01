export interface EventRegisterData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  address_number: number;
  complement: string;
  maps_url: string | undefined;
  image_url: string | undefined;
  status: "active" | "inactive";
  price: string;
  level_id: number;
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
  maps_url?: string;
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

export interface EventsResponse {
  events: Event[];
}

export interface EventResponse {
  event: Event;
}
