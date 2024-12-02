import {
  User,
  UserByUsernameApiResponse,
  UserByUsernameWithSelectApiResponse,
  UserRegisterData,
  UserResponse,
} from "@/interfaces/user";
import api from "@/lib/axios";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetUser = (username: string) => {
  const { data: dataSession } = useSession();
  const token = dataSession?.token.user.token;
  return useQuery<UserResponse>({
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

export function useGetUserByUsername(): UseQueryResult<UserByUsernameApiResponse>;

export function useGetUserByUsername(
  selectData: (
    data: UserByUsernameApiResponse
  ) => UserByUsernameWithSelectApiResponse
): UseQueryResult<UserByUsernameWithSelectApiResponse>;

// Implementação
export function useGetUserByUsername(
  selectData?: (
    data: UserByUsernameApiResponse
  ) => UserByUsernameWithSelectApiResponse
) {
  const { data: dataSession } = useSession();
  const username = dataSession?.payload.username;
  const token = dataSession?.token.user.token;

  return useQuery({
    queryKey: ["userData", username],
    queryFn: async () => {
      const response = await api.get(`/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!token && !!username,
    ...(selectData && { select: selectData }),
  }) as unknown as UseQueryResult<
    typeof selectData extends undefined
      ? UserByUsernameApiResponse
      : UserByUsernameWithSelectApiResponse
  >;
}

export function useGetUserClubId() {
  const queryData = useGetUserByUsername((data) => {
    return {
      user: {
        club: {
          id: data.user.club?.id,
        },
      },
    };
  });

  const club_id = queryData.data?.user.club?.id;

  return club_id;
}

export function useGetUserCredits() {
  const queryData = useGetUserByUsername((data) => {
    return {
      user: {
        credits: data.user.credits,
      },
    };
  });

  const credits = queryData.data?.user.credits;

  return credits;
}
