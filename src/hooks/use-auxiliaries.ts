import { GameStyleResponse } from "@/interfaces/game-style";
import { HandGripResponse } from "@/interfaces/hand-grip";
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
    enabled: !!token,
  });
  return { ...query, data: query.data?.data };
}

export function useHandGripsData() {
  const { data: session } = useSession();
  const token = session?.token.user.token;
  const query = useQuery({
    queryKey: ["hand_grips"],
    queryFn: async () => {
      const response = await api.get<HandGripResponse>("/hand-grips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    enabled: !!token,
  });
  return { ...query, data: query.data?.data };
}

export function useGameStylesData() {
  const { data: session } = useSession();
  const token = session?.token.user.token;
  const query = useQuery({
    queryKey: ["game_styles"],
    queryFn: async () => {
      const response = await api.get<GameStyleResponse>("/game-styles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    enabled: !!token,
  });
  return { ...query, data: query.data?.data };
}

export function useVisibilityTypesData() {
  const { data: session } = useSession();
  const token = session?.token.user.token;
  const query = useQuery({
    queryKey: ["visibility_types"],
    queryFn: async () => {
      const response = await api.get<VisibilityTypeResponse>(
        "/visibility-types",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    },
    enabled: !!token,
  });
  return { ...query, data: query.data?.data };
}
