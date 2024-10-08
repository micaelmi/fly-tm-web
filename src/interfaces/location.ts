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

export interface Location {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
