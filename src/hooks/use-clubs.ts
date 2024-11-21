import {
  Club,
  ClubRegisterData,
  ClubResponse,
  ClubsResponse,
} from "@/interfaces/club";
import { UserResponse } from "@/interfaces/user";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useClubsData() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const query = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await api.get<ClubsResponse>("/clubs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  return { ...query, data: query.data?.data };
}

export function useCreateClub() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (data: ClubRegisterData) => {
      const response = await api.post("clubs", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao criar clube:", error);
    },
  });
}

export const useGetClub = (clubId: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const username = dataSession?.payload.username; // Adicionando o username da sessão

  return useQuery<ClubResponse, Error, ClubResponse & { isOwner: boolean }>({
    queryKey: ["club", clubId],
    queryFn: async () => {
      const response = await api.get(`/clubs/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    select: (data) => ({
      ...data,
      isOwner: data.club.owner_username === username, // Determina se é o dono
    }),
    enabled: !!clubId && !!token, // Previne execução com valores inválidos
  });
};

export const useGetMembersByClub = (clubId: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<UserResponse>({
    queryKey: ["membersByClub", clubId],
    queryFn: async () => {
      const response = await api.get(`/users/club/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!clubId && !!token, // Isso evita que a query seja executada sem um clubId válido
  });
};

export function useDeleteClub() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (clubId: string) => {
      const response = await api.delete(`clubs/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao excluir clube:", error);
    },
  });
}

export function useRemoveMemberFromClub() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async ({
      clubId,
      userId,
    }: {
      clubId: string;
      userId: string;
    }) => {
      if (!token) {
        throw new Error("Token não disponível.");
      }
      const response = await api.get(`clubs/${clubId}/leave/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao remover usuário:", error);
    },
  });
}

export function useUpdateClub() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async ({
      clubId,
      data,
    }: {
      clubId: string;
      data: ClubRegisterData;
    }) => {
      const response = await api.put(`clubs/${clubId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao atualizar clube:", error);
    },
  });
}
