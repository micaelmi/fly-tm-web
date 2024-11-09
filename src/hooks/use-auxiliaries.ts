import { LevelResponse } from "@/interfaces/level";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useLevelsData() {
  const { data: session } = useSession();
  const token = session?.token.user.token;
  const query = useQuery({
    queryKey: ["levels"],
    queryFn: async () => {
      const response = await api.get<LevelResponse>("/levels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
  });
  return { ...query, data: query.data?.data };
}
