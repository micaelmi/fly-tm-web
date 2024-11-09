"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { UserData } from "../page";
import api from "@/lib/axios";
import Navbar from "@/components/navbar";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import InputDefault from "@/components/form/input-default";
import { z } from "zod";
import UserUpdateForm from "@/modules/users/user-update-form";

export default function EditUser() {
  const username_params = useParams().username;
  const session = useSession().data;

  const token = session?.token.user.token;

  const user = useQuery({
    queryKey: ["userData", username_params],
    queryFn: async (): Promise<AxiosResponse<Partial<UserData>>> => {
      return await api.get(`/users/${username_params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
  });

  if (user.isLoading)
    return (
      <p className="w-full text-center animate-pulse">
        Carregando seu perfil...
      </p>
    );
  if (user.error)
    return <p>Erro ao carregar seu perfil: {user.error.message}</p>;

  const user_data = user.data?.data.user;
  if (!user_data) return <p>Desculpe, seus dados não estão disponíveis.</p>;

  return (
    <>
      <Navbar />
      <UserUpdateForm user_data={user_data} />
    </>
  );
}
