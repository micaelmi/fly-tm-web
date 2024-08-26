import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosResponse } from "axios";
import { User, UserRegisterData, UserResponse } from "@/interfaces/user";

const fetchUsers = async (): Promise<AxiosResponse<UserResponse>> => {
  const response = await api.get<UserResponse>("/users");
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

const postUser = async (data: UserRegisterData) => {
  return await api.post("users", data);
};

export function useUserMutate() {
  // const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: postUser,
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["users"]);
    // },
  });
  return mutate;
}
