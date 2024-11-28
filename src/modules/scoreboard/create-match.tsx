"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputDefault from "@/components/form/input-default";
import { PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { useCreateMatch } from "@/hooks/use-scoreboards";
import { useSession } from "next-auth/react";

const FormSchema = z.object({
  player1: z.string().min(2, {
    message: "Digite o nome do jogador 1.",
  }),
  player2: z.string().min(2, {
    message: "Digite o nome do jogador 2.",
  }),
  games: z.string().length(1, { message: "Escolha uma opção" }),
  firstService: z.string().length(1, { message: "Escolha uma opção" }),
});

export default function CreateMatch() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      player1: "",
      player2: "",
      games: "",
      firstService: "",
    },
  });
  const userId = useSession().data?.payload.sub;
  const { mutate, isError, error } = useCreateMatch();
  const router = useRouter();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!userId) {
      toast.error("Você precisa estar logado para continuar.");
      return;
    }
    const match = {
      games: Number(data.games),
      player1: {
        name: data.player1,
        games: 0,
        points: [],
      },
      player2: {
        name: data.player2,
        games: 0,
        points: [],
      },
      firstService: Number(data.firstService),
      datetime: new Date(),
    };

    localStorage.setItem("match", JSON.stringify(match));

    mutate(
      {
        player1: data.player1,
        player2: data.player2,
        better_of: Number(data.games),
        user_id: userId,
      },
      {
        onSuccess: async (match) => {
          toast.success("Sucesso! O jogo foi criado.");
          setTimeout(() => {
            router.push(`/scoreboard/match?id=${match.matchId}`);
          }, 2000);
        },
      }
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 font-semibold">
          <PlusCircle size={24} /> Novo jogo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo jogo</DialogTitle>
          <DialogDescription>Inicie uma nova partida.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <InputDefault
              control={form.control}
              name="player1"
              label="Jogador 1"
              placeholder="Digite o nome do jogador 1"
            />
            <InputDefault
              control={form.control}
              name="player2"
              label="Jogador 2"
              placeholder="Digite o nome do jogador 2"
            />
            <FormField
              control={form.control}
              name="games"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sets</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione melhor de quantos sets" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">3</SelectItem>
                      <SelectItem value="3">5</SelectItem>
                      <SelectItem value="4">7</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quem começa sacando?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o jogador que começará" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Jogador 1</SelectItem>
                      <SelectItem value="2">Jogador 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Começar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
