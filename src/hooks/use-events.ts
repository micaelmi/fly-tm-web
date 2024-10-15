import { EventRegisterData } from "@/interfaces/event";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const postEvent = async (data: EventRegisterData) => {
  return await api.post("events", data);
};
export function useCreateEvent() {
  return useMutation({
    mutationFn: postEvent,
  });
}
