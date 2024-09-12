import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

const recoverAccount = async (data: { email: string }) => {
  return await api.post("users/recover-account", data);
};

export function useTokenMutate() {
  const mutate = useMutation({
    mutationFn: recoverAccount,
  });
  return mutate;
}
