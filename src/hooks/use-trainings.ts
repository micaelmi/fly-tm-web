"useClient";

import { TrainingRegisterData, TrainingsResponse } from "@/interfaces/training";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useTrainingsDataByUser() {
  const { data: sessionData } = useSession();
  const user_id = sessionData?.payload.sub;
  const token = sessionData?.token.user.token;

  return useQuery({
    queryKey: ["trainingsByUser", user_id],
    queryFn: async () => {
      return await api.get<TrainingsResponse>(`/trainings/user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!user_id && !!token,
  });
}

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
