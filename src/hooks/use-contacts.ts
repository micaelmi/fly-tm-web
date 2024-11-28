import {
  ContactRegisterData,
  ContactReplyData,
  ContactsResponse,
  ContactTypesResponse,
} from "@/interfaces/contact";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useCreateContact() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (data: ContactRegisterData) => {
      const response = await api.post("contacts", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao criar contacte:", error);
    },
  });
}

export function useContactsData() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const query = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await api.get<ContactsResponse>("/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!token,
  });
  return { ...query, data: query.data?.data };
}

export function useContactTypesData() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  const query = useQuery({
    queryKey: ["contactTypes"],
    queryFn: async () => {
      const response = await api.get<ContactTypesResponse>("/contact-types", {
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

export function useDeleteContact() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async (contactId: string) => {
      const response = await api.delete(`contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao excluir contato:", error);
    },
  });
}

export function useReplyContact() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async ({
      contactId,
      data,
    }: {
      contactId: string;
      data: ContactReplyData;
    }) => {
      const response = await api.patch(`contacts/${contactId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Erro ao reponder o contato:", error);
    },
  });
}

export const useGetContactsByUser = (userId: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<ContactsResponse>({
    queryKey: ["ContactsByUserId", userId],
    queryFn: async () => {
      const response = await api.get(`/contacts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!userId && !!token,
  });
};
