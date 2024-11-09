import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosResponse } from "axios";
import { User, UserRegisterData, UserResponse } from "@/interfaces/user";
import { useSession } from "next-auth/react";

const fetchUsers = async (): Promise<AxiosResponse<UserResponse>> => {
  const response = await api.get<UserResponse>("/users", {
    headers: {},
  });
  console.log(response);
  return response;
};

export function useUsersData() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    // enabled: !!id, // if...
    // retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  return { ...query, data: query.data?.data };
}

export const useGetUser = (userId: string) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId, // Isso evita que a query seja executada sem um userId válido
  });
};

const postUser = async (data: UserRegisterData) => {
  return await api.post("users", data);
};
export function useCreateUser() {
  return useMutation({
    mutationFn: postUser,
  });
}

interface ChangePasswordData {
  email: string;
  password: string;
  token_number: number;
}

const changePassword = async (data: ChangePasswordData) => {
  return await api.put(`users/recover-account/change-password`, data);
};
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

const editUser = async (userId: string, data: Partial<User>) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return await api.put(`/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export function useEditUser() {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      editUser(userId, data),
  });
}
