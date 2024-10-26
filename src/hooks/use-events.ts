import { EventRegisterData } from "@/interfaces/event";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const postEvent = async (data: EventRegisterData) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;

  return await api.post("events", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export function useCreateEvent() {
  return useMutation({
    mutationFn: postEvent,
  });
}
