"use client";

import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import {
  Coins,
  Fire,
  Gear,
  InstagramLogo,
  MapPinLine,
  Pencil,
} from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export interface UserData {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    created_at: Date;
    training_days: number;
    state: string;
    city: string;
    instagram: string;
    image_url: string;
    user_type: number;
    level: number;
    game_style: number;
    club: {
      id: string;
      name: string;
      logo_url: string;
    };
    hand_grip: number;
    credits: number;
  };
}

export default function User() {
  const username_params = useParams().username;
  const session = useSession().data;

  const usersOwn = username_params === session?.payload.username;

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
      <p className="w-full text-center animate-pulse">Carregando perfil...</p>
    );
  if (user.error) return <p>Erro ao carregar perfil: {user.error.message}</p>;

  console.log(user.data?.data);
  const user_data = user.data?.data.user;
  if (!user_data) return <p>Dados do usuário não disponíveis</p>;

  return (
    <>
      <Navbar />
      <div className="mt-5 mb-5 container">
        <h1 className="mb-5 font-semibold text-3xl">Meu perfil</h1>
        <div className="flex gap-32">
          <div className="flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col items-center w-full leading-3">
              {usersOwn ? (
                <Link
                  href={`./${user_data.username}/edit`}
                  className="relative group"
                >
                  <Image
                    src={
                      user_data.image_url ??
                      `https://api.dicebear.com/9.x/thumbs/svg?seed=${user_data.id}`
                    }
                    width={150}
                    height={150}
                    alt="Imagem do perfil"
                    className="border-primary group-hover:opacity-50 border rounded-full transition duration-300 aspect-square"
                    priority
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <Pencil className="text-3xl" />
                  </div>
                </Link>
              ) : (
                <Image
                  src={
                    user_data.image_url ??
                    `https://api.dicebear.com/9.x/thumbs/svg?seed=${user_data.id}`
                  }
                  width={150}
                  height={150}
                  alt="Imagem do perfil"
                  className="border-primary border rounded-full aspect-square"
                  priority
                  unoptimized={true}
                />
              )}
              <Gear className="text-3xl hover:animate-spin hover:cursor-pointer self-end" />
              <p className="font-semibold text-xl">{user_data.name}</p>
              <p>{user_data.username}</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-300 px-2 rounded-lg w-52 h-12 font-semibold text-black truncate">
              <Fire size={25} weight="fill" className="text-orange-400" />
              <Separator orientation="vertical" />
              <p className="flex flex-1 justify-center items-center">
                {user_data.training_days + " dias de treino"}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500 px-2 rounded-lg w-52 h-12 font-semibold text-black leading-5">
              <Coins size={25} />
              <Separator orientation="vertical" />
              <div className="flex flex-col flex-1 justify-center items-center">
                {user_data.credits + " créditos"}
                <a className="text-primary text-xs underline">ver detalhes</a>
              </div>
            </div>
            <div className="flex flex-col gap-3 self-start">
              <div className="flex items-center gap-2">
                <MapPinLine weight="fill" className="text-3xl text-red-600" />
                {user_data.city
                  ? user_data.city + " - " + user_data.state
                  : "Não informado"}
              </div>
              <div className="flex items-center gap-2">
                <InstagramLogo className="text-3xl text-yellow-500" />
                {user_data.instagram ?? "Não informado"}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-32">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-xl">Apresentação</h2>
              <p className="text-sm">
                {user_data.bio ?? "Nenhuma descrição fornecida"}
              </p>
            </div>
            <div className="flex gap-32">
              <div className="flex flex-col justify-center items-center gap-2">
                <h2 className="font-semibold text-xl">Clube</h2>
                <Image
                  src={
                    user_data.club && user_data.club.logo_url
                      ? user_data.club.logo_url
                      : "/mascot-sad.svg"
                  }
                  width={100}
                  height={100}
                  className="border-primary bg-slate-300 p-2 border rounded-full aspect-square"
                  alt="Imagem do clube"
                  unoptimized={true}
                />
                <p className="max-w-24 text-sm">
                  {user_data.club
                    ? user_data.club.name
                    : "Este jogador não está em nenhum clube"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-xl">Informações do atleta</h2>
                <div className="flex flex-col text-sm">
                  <p>Empunhadura: {user_data.hand_grip ?? "Não informado"}</p>
                  <p>Estilo: {user_data.game_style ?? "Não informado"}</p>
                  <p>Nível: {user_data.level ?? "Não informado"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
