"useClient";

import {
  Training,
  TrainingRegisterData,
  TrainingsResponse,
} from "@/interfaces/training";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useGetUserClubId } from "./use-users";
import { useMemo } from "react";

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
  const stableKey = useMemo(() => ["trainingsByClub", club_id], [club_id]);
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const stableToken = useMemo(
    () => dataSession?.token.user.token,
    [dataSession]
  );
  return useQuery({
    queryKey: stableKey,
    queryFn: async () => {
      const response = await api.get(`/trainings/club/${club_id}`, {
        headers: {
          Authorization: `Bearer ${stableToken}`,
        },
      });
      return response;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
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
