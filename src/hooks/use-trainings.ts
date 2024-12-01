"useClient";

import {
  IncrementTrainingDaysResponse,
  Training,
  TrainingRegisterData,
  TrainingsByIdResponse,
  TrainingsResponse,
} from "@/interfaces/training";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useGetUserClubId } from "./use-users";
import { useMemo } from "react";
import { User } from "@/interfaces/user";

export function useTrainingsData() {
  const { data: sessionData } = useSession();
  const token = sessionData?.token.user.token;

  return useQuery({
    queryKey: ["trainings"],
    queryFn: async () => {
      const response = await api.get<TrainingsResponse>("/trainings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    enabled: !!token,
  });
}

export function useTrainingsDataByClub() {
  const club_id = useGetUserClubId();
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery({
    queryKey: ["trainingsByClub", club_id],
    queryFn: async () => {
      const response = await api.get(`/trainings/club/${club_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    enabled: !!club_id && !!token,
  });
}

export function useTrainingsDataByUser() {
  const { data: sessionData } = useSession();
  const user_id = sessionData?.payload.sub;
  const token = sessionData?.token.user.token;

  return useQuery({
    queryKey: ["trainingsByUser", user_id],
    queryFn: async () => {
      const response = await api.get<TrainingsResponse>(
        `/trainings/user/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    },
    enabled: !!user_id && !!token,
  });
}

export function useTrainingById(training_id: string) {
  const token = useSession().data?.token.user.token;

  return useQuery({
    queryKey: ["trainingData", training_id],
    queryFn: async () => {
      const response = await api.get<TrainingsByIdResponse>(
        `/trainings/${training_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!token && !!training_id,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
    retry: 1,
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

export function useEditTraining() {
  const token = useSession().data?.token.user.token;

  return useMutation({
    mutationFn: async ({
      trainingId,
      data,
    }: {
      trainingId: string;
      data: Partial<Training>;
    }) => {
      return await api.put(`/trainings/${trainingId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
}

export function useDeleteTraining() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (trainingId: string) => {
      const response = await api.delete(`trainings/${trainingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao excluir treino:", error);
    },
  });
}

export function useIncrementTrainingDays() {
  const token = useSession().data?.token.user.token;

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await api.put<IncrementTrainingDaysResponse>(
        `/trainings/${userId}/increment-training-days`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.trainingDays;
    },
  });
}
