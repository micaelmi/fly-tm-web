import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosResponse } from "axios";
import { User, UserRegisterData, UsersResponse } from "@/interfaces/user";
import { useSession } from "next-auth/react";

const fetchUsers = async (): Promise<AxiosResponse<UsersResponse>> => {
  const response = await api.get<UsersResponse>("/users", {
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

export const useGetUser = (username: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<User>({
    queryKey: ["userByUsername", username],
    queryFn: async () => {
      const response = await api.get(`/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!username && !!token,
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

export function useEditUser() {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<User>;
    }) => {
      return await api.put(`/users/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
}
