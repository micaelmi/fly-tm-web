import { CreditData } from "@/interfaces/credit";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useManageCredits() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;

  return useMutation({
    mutationFn: async (data: CreditData) => {
      return await api.post(`/credits`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onError: (error) => {
      console.error("Erro ao gerenciar créditos:", error);
    },
  });
}
