import {
  CreditData,
  CreditTransactionResponse,
  PixPaymentRegisterData,
  UserCredits,
} from "@/interfaces/credit";
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

export const useGetCreditsByUser = (userId: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<UserCredits>({
    queryKey: ["CreditsByUserId", userId],
    queryFn: async () => {
      const response = await api.get(`/credits/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userId && !!token,
  });
};

export function useCreatePixPayment() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;

  return useMutation({
    mutationFn: async (data: PixPaymentRegisterData) => {
      return await api.post(`/payments/pix`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onError: (error) => {
      console.error("Erro ao gerar pix", error);
    },
  });
}

export const useGetTransactionsByUser = (userId: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<CreditTransactionResponse>({
    queryKey: ["CreditTransactionsByUser", userId],
    queryFn: async () => {
      const response = await api.get(`/credits/${userId}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userId && !!token,
  });
};
