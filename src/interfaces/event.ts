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
  maps_url: string;
  description: string;
  image_url: string | undefined;
  status: "active" | "inactive";
  complement: string;
  level_id: number;
  price: string;
  user_id: string | undefined;
}
