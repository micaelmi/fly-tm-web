"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/interfaces/user";
import api from "@/lib/axios";
import { Pencil } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

export function ChangeUsernameForm() {
  const session = useSession().data;
  const token = session?.token.user.token;
  const id = session?.payload.sub;

  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  // busca usuário pelo username digitado
  useQuery({
    queryKey: ["usernameSearch", username],
    queryFn: async (): Promise<AxiosResponse<UserData>> => {
      try {
        const response = await api.get(`/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAvailable(false); // Limpa a mensagem ao encontrar o usuário
        return response.data; // Retorna os dados diretamente como UserData
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          setIsAvailable(true);
        } else {
          setIsAvailable(false);
        }
        throw error; // Re-lança o erro para que a query reconheça como erro também
      }
    },
    enabled: !!token && !!username,
    select: (data) => {
      return {
        userId: data.data.user.id,
      };
    },
  });

  async function updateUsername() {
    try {
      if (id) {
        await api.put(
          `/users/${id}/change-username`,
          { username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Nome de usuário alterado com sucesso!");
        logout();
      }
    } catch (error) {
      alert("Erro ao alterar o nome de usuário. Tente novamente.");
    }
  }
  const router = useRouter();
  async function logout() {
    await signOut({
      redirect: false,
    });
    router.replace("/login");
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:bg-blue-950 p-1 rounded-full hover:text-primary">
          <Pencil size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar nome de usuário</DialogTitle>
          <DialogDescription>
            Após realizar esta troca, você precisará fazer o login novamente.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Crie um novo nome de usuário"
          onChange={useDebouncedCallback((event) => {
            setUsername(event.target.value);
          }, 500)}
          className={`${
            !isAvailable && username
              ? "border-red-500 focus-visible:ring-red-400"
              : "border-gray-300"
          } rounded-md p-2  `}
        />
        {username && !isAvailable && (
          <Label className="-mt-2 ml-1 text-red-400">
            Este nome já está em uso
          </Label>
        )}
        <DialogFooter>
          <Button
            type="submit"
            className="font-semibold"
            disabled={username.length < 4 || !isAvailable}
            onClick={updateUsername}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
