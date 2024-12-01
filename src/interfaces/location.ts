export interface State {
  id: number;
  nome: string;
  sigla: string;
  regiao: Object;
}

export interface City {
  id: number;
  nome: string;
  microrregiao: Object;
  regiao_imediata: Object;
}

export interface LocationByCep {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  complement: string;
}

export interface Location {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  estado: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  regiao: string;
  siafi: string;
  uf: string;
  unidade: string;
}
