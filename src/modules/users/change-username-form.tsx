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
import api from "@/lib/axios";
import { Pencil } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function ChangeUsernameForm() {
  const [username, setUsername] = useState("");
  // const { isLoading, isError, data } = useQuery({
  //   queryKey: ["username"],
  //   queryFn: async () => {
  //     return await api.get(`/users/${username}`);
  //   },

  //   enabled: /^\d{8}$/.test(username),
  //   select: (data) => {
  //     return {
  //       state: data.data.uf,
  //       city: data.data.localidade,
  //     };
  //   },
  // });
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
        />
        <DialogFooter>
          <Button type="submit" className="font-semibold">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
