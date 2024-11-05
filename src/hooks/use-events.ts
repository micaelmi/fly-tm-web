import { EventRegisterData, EventResponse } from "@/interfaces/event";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useEventsData() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const query = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get<EventResponse>("/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      return response;
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    // enabled: !!id, // if...
    // retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  return { ...query, data: query.data?.data };
}

export function useCreateEvent() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (data: EventRegisterData) => {
      return await api.post("events", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onError: (error) => {
      console.error("Erro ao criar evento:", error);
    },
  });
}
