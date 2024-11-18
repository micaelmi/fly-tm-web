"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetUser } from "@/hooks/use-users";
import { User, UserData, UserResponse } from "@/interfaces/user";
import api from "@/lib/axios";
import { isValidUrl } from "@/lib/utils";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

export function AddClubMemberDialog({ clubId }: { clubId: string }) {
  const session = useSession().data;
  const token = session?.token.user.token;
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [name, setName] = useState<string | undefined>(undefined);
  const [found, setFound] = useState(false);
  const [hasClub, setHasClub] = useState(false);

  useQuery({
    queryKey: ["usernameSearch", username],
    queryFn: async (): Promise<UserResponse> => {
      try {
        const response = await api.get<UserResponse>(`/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFound(true); // Limpa a mensagem ao encontrar o usuário
        setName(response.data.user.name); // Salva o nome do usuário
        setHasClub(response.data.user.club ? true : false);
        return response.data; // Retorna os dados diretamente como UserData
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          setFound(false);
        } else {
          setFound(true);
        }
        throw error; // Re-lança o erro para que a query reconheça como erro também
      }
    },
    enabled: !!token && !!username,
  });

  async function addMemberToClub() {
    try {
      await api.put(
        `/clubs/${clubId}/add-member`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Membro adicionado ao clube com sucesso!");

      // Invalida a query para refazer a busca dos dados do clube
      queryClient.invalidateQueries({
        queryKey: ["club", clubId], // Defina explicitamente como uma QueryKey
      });

      setUsername("");
      setName(undefined);
      setFound(false);
      setHasClub(false);
    } catch (error) {
      toast.error("Não foi possível adicionar o membro ao clube.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar membro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Adicionar membro ao clube
          </DialogTitle>
          <DialogDescription>
            Este usuário deve estar sem um clube
          </DialogDescription>
          <div className="pt-4">
            <Input
              placeholder="Digite o nome de usuário da pessoa"
              onChange={useDebouncedCallback((event) => {
                setUsername(event.target.value);
              }, 500)}
              className={`${
                !found && username
                  ? "border-red-500 focus-visible:ring-red-400"
                  : "border-gray-300"
              } rounded-md p-2 mb-4`}
            />
            {found && !hasClub && (
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-400">
                  Encontrado: {name}
                </span>
                <Button
                  onClick={addMemberToClub}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Adicionar
                </Button>
              </div>
            )}

            {found && hasClub && (
              <span className="font-bold text-red-400">
                Usuário já está em um clube
              </span>
            )}

            {!found && username && (
              <span className="font-bold text-red-400">
                Usuário não encontrado
              </span>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
