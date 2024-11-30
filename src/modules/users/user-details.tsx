"use client";

import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import ShareButton from "@/components/share-button";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "@/interfaces/user";
import api from "@/lib/axios";
import { isValidUrl } from "@/lib/utils";
import LogoutButton from "@/modules/auth/logout-button";
import { ChangeUsernameForm } from "@/modules/users/change-username-form";
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

interface UserData {
  user: User;
}

export default function UserDetails() {
  const username_params = useParams().username;
  const session = useSession().data;

  const own_page = username_params === session?.payload.username;

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

  if (user.isLoading) return <Loading />;
  if (user.error) return <p>Erro ao carregar perfil: {user.error.message}</p>;

  const user_data = user.data?.data.user;

  return (
    <>
      {!user_data ? (
        <p>Dados do usuário não disponíveis</p>
      ) : (
        <>
          <Navbar />
          <div className="mt-5 mb-5 container">
            <h1 className="mb-5 font-semibold text-3xl">Meu perfil</h1>
            <div className="flex gap-32">
              <div className="flex flex-col justify-center items-center gap-5">
                <div className="flex flex-col items-center w-full leading-3">
                  {own_page ? (
                    <>
                      <Link
                        href={`./${user_data.username}/edit`}
                        className="relative group"
                      >
                        <Image
                          src={
                            user_data.image_url &&
                            isValidUrl(user_data.image_url)
                              ? user_data.image_url
                              : `https://api.dicebear.com/9.x/thumbs/svg?seed=${user_data.id}`
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
                      <Link
                        className="text-3xl hover:animate-spin hover:cursor-pointer self-end"
                        href={`./${user_data.username}/edit`}
                      >
                        <Gear />
                      </Link>
                    </>
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
                  <p className="pb-2 font-semibold text-xl">{user_data.name}</p>
                  <div className="flex justify-center items-center gap-1">
                    <p>{user_data.username}</p>
                    {own_page && <ChangeUsernameForm />}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-300 px-2 rounded-lg w-52 h-12 font-semibold text-black truncate">
                  <Fire size={25} weight="fill" className="text-orange-400" />
                  <Separator orientation="vertical" />
                  <p className="flex flex-1 justify-center items-center">
                    {user_data.training_days + " treinos concluídos"}
                  </p>
                </div>
                {own_page && (
                  <div className="flex items-center gap-2 bg-yellow-500 px-2 rounded-lg w-52 h-12 font-semibold text-black leading-5">
                    <Coins size={25} />
                    <Separator orientation="vertical" />
                    <div className="flex flex-col flex-1 justify-center items-center">
                      {user_data.credits + " créditos"}
                      <Link
                        href={`/credits/${user_data.id}`}
                        className="text-primary text-xs underline"
                      >
                        ver detalhes
                      </Link>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3 self-start">
                  {user_data.city && (
                    <div className="flex items-center gap-2">
                      <MapPinLine
                        weight="fill"
                        className="text-3xl text-red-600"
                      />
                      {user_data.city} - {user_data.state}
                    </div>
                  )}
                  {user_data.instagram && (
                    <div className="flex items-center gap-2">
                      <InstagramLogo className="text-3xl text-yellow-500" />
                      {user_data.instagram}
                    </div>
                  )}
                </div>
              </div>
              {/* col 2 */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-xl">Apresentação</h2>
                  <p className="max-w-lg text-justify text-sm">
                    {user_data.bio === null || !user_data.bio
                      ? "Nenhuma descrição fornecida."
                      : user_data.bio}
                  </p>
                </div>
                <div className="flex gap-32">
                  {/* club */}
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
                  {/* athlete info */}
                  <div className="flex flex-col gap-2">
                    <h2 className="font-semibold text-xl">
                      Informações do atleta
                    </h2>
                    <div className="flex flex-col gap-1 text-lg">
                      <p>
                        Empunhadura:{" "}
                        {user_data.hand_grip
                          ? user_data.hand_grip.title
                          : "Não informado"}
                      </p>
                      <p>
                        Estilo:{" "}
                        {user_data.game_style
                          ? user_data.game_style.title
                          : "Não informado"}
                      </p>
                      <p>
                        Nível:{" "}
                        {user_data.level
                          ? user_data.level.title
                          : "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    {user_data._count.events > 0 && (
                      <Link
                        href={`/users/my-events/${user_data.id}`}
                        className={`${buttonVariants({ variant: "default" })} flex-1`}
                      >
                        Meus Eventos
                      </Link>
                    )}
                    {user_data._count.contacts > 0 && (
                      <Link
                        href={`/users/my-contacts/${user_data.id}`}
                        className={`${buttonVariants({ variant: "default" })} flex-1`}
                      >
                        Meus Contatos
                      </Link>
                    )}
                  </div>
                  <ShareButton
                    link={`http://localhost:3000/users/${user_data.username}`}
                    what_is_being_shared="perfil"
                  />
                  {own_page && <LogoutButton />}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
