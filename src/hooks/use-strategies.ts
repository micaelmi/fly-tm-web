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
import {
  Strategy,
  StrategyByIdResponse,
  StrategyRegisterData,
  StrategyResponse,
} from "@/interfaces/strategy";

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

export function useStrategyById(strategy_id: string) {
  const token = useSession().data?.token.user.token;

  return useQuery({
    queryKey: ["strategyData", strategy_id],
    queryFn: async () => {
      const response = await api.get<StrategyByIdResponse>(
        `/strategies/${strategy_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!token && !!strategy_id,
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

export function useEditStrategy() {
  const token = useSession().data?.token.user.token;

  return useMutation({
    mutationFn: async ({
      strategyId,
      data,
    }: {
      strategyId: string;
      data: Partial<Strategy>;
    }) => {
      return await api.put(`/strategies/${strategyId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
}

export function useDeleteStrategy() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (strategyId: string) => {
      const response = await api.delete(`strategies/${strategyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao excluir estratégia:", error);
    },
  });
}
