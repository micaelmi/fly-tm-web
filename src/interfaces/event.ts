export interface EventRegisterData {
  name: string;
  startsAt: Date;
  endsAt: Date;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  level: string;
  price: string;
  representationUrl: File | undefined;
  representationColor: string | undefined;
}
