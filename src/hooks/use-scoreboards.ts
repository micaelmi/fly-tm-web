import {
  GameRegisterData,
  MatchesResponse,
  MatchRegisterData,
} from "@/interfaces/scoreboard";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateMatch() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (data: MatchRegisterData) => {
      const response = await api.post("scoreboards", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao criar jogo:", error);
    },
  });
}

export function useCreateGame() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (data: GameRegisterData) => {
      const response = await api.post("scoreboards/games", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao salvar game:", error);
    },
  });
}

export const useGetMatchesByUser = (userId: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<MatchesResponse>({
    queryKey: ["matchesByUserId", userId],
    queryFn: async () => {
      const response = await api.get(`/scoreboards/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userId && !!token,
  });
};

export function useDeleteMatch() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (matchId: string) => {
      const response = await api.delete(`scoreboards/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao excluir contato:", error);
    },
  });
}
