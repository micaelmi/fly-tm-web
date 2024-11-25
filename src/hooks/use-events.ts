import {
  Event,
  EventRegisterData,
  EventResponse,
  EventsResponse,
} from "@/interfaces/event";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useEventsData() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const query = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get<EventsResponse>("/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    enabled: !!dataSession && !!token, // if...
    // retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  return { ...query, data: query.data?.data };
}

export function useGetEvent(eventId: string) {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const query = useQuery({
    queryKey: ["eventData", eventId],
    queryFn: async () => {
      const response = await api.get<EventResponse>(`/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    enabled: !!dataSession && !!token, // if...
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

export const useGetEventsByUser = (userId: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<EventsResponse>({
    queryKey: ["EventsByUserId", userId],
    queryFn: async () => {
      const response = await api.get(`/events/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userId && !!token,
  });
};

export function useDeleteEvent() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.delete(`events/${eventId}`, {
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

export function useUpdateEvent() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async ({
      eventId,
      data,
    }: {
      eventId: string;
      data: Partial<Event>;
    }) => {
      const response = await api.put(`events/${eventId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao atualizar evento:", error);
    },
  });
}
