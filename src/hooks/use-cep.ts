import { LocationByCep } from "@/interfaces/location";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useCep = (cep: string) => {
  return useQuery({
    queryKey: ["location", cep],
    queryFn: async () => {
      const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
      return response.data;
    },

    enabled: !!cep && /^\d{8}$/.test(cep),
    select: (data) => {
      return {
        state: data.uf,
        city: data.localidade,
        neighborhood: data.bairro,
        street: data.logradouro,
        complement: data.complemento,
      };
    },
  });
};

export { useCep };
