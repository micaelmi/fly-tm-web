import { ClubRegisterData, ClubResponse } from "@/interfaces/club";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useClubsData() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const query = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await api.get<ClubResponse>("/clubs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
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
      return await api.post("clubs", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onError: (error) => {
      console.error("Erro ao criar clube:", error);
    },
  });
}
