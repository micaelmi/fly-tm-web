"useClient";

import { TrainingRegisterData } from "@/interfaces/training";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateTraining() {
  const { data: sessionData } = useSession();
  const token = sessionData?.token.user.token;

  return useMutation({
    mutationFn: async (data: TrainingRegisterData) => {
      return await api.post("/trainings", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onError: (error) => {
      console.error("Erro ao criar o treinamento: ", error);
    },
  });
}
