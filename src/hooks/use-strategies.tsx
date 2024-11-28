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
import { StrategyRegisterData, StrategyResponse } from "@/interfaces/strategy";

export function useStrategiesData() {
  const { data: sessionData } = useSession();
  const token = sessionData?.token.user.token;

  return useQuery({
    queryKey: ["strategies"],
    queryFn: async () => {
      const response = await api.get<StrategyResponse>("/strategies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    enabled: !!token,
  });
}

export function useStrategiesDataByClub() {
  const club_id = useGetUserClubId();
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;

  return useQuery({
    queryKey: ["strategiesByClub", club_id],
    queryFn: async () => {
      const response = await api.get<StrategyResponse>(
        `/strategies/club/${club_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    },
    enabled: !!club_id && !!token,
  });
}

export function useStrategiesDataByUser() {
  const { data: sessionData } = useSession();
  const user_id = sessionData?.payload.sub;
  const token = sessionData?.token.user.token;

  return useQuery({
    queryKey: ["strategiesByUser", user_id],
    queryFn: async () => {
      const response = await api.get<StrategyResponse>(
        `/strategies/user/${user_id}`,
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

export function useCreateStrategy() {
  const { data: sessionData } = useSession();
  const token = sessionData?.token.user.token;

  return useMutation({
    mutationFn: async (data: StrategyRegisterData) => {
      return await api.post("/strategies", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onError: (error) => {
      console.error("Erro ao criar a estratégia: ", error);
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
      console.error("Erro ao excluir evento:", error);
    },
  });
}
