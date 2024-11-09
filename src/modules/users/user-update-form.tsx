"use client";

import DefaultCombobox from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditUser } from "@/hooks/use-users";
import { Location } from "@/interfaces/location";
import api from "@/lib/axios";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(4).optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  instagram: z.string().optional(),
  image_file: z.instanceof(File),
  status: z.enum(["active", "inactive"]).optional(),
  level_id: z.number().optional(),
  game_style_id: z.number().optional(),
  hand_grip_id: z.number().optional(),
});

interface UserFilteredData {
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
}

interface UserUpdateFormProps {
  user_data: UserFilteredData;
}

export default function UserUpdateForm({ user_data }: UserUpdateFormProps) {
  const [cep, setCep] = useState("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [handGrips, setHandGrips] = useState([
    { value: 1, label: "Clássica" },
    { value: 2, label: "Caneta" },
    { value: 3, label: "Classineta" },
  ]);
  const [gameStyles, setGameStyles] = useState([
    { value: 1, label: "Kato" },
    { value: 2, label: "Pino" },
    { value: 3, label: "Ataque" },
  ]);
  const [levels, setLevels] = useState([
    { value: 1, label: "Iniciante" },
    { value: 2, label: "Intermediário" },
    { value: 3, label: "Avançado" },
  ]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user_data.email,
      name: user_data.name,
      image_file: new File([], ""),
      city: user_data.city,
      state: user_data.state,
      instagram: user_data.instagram ?? "",
      bio: user_data.bio ?? "",
      game_style_id: user_data.game_style ?? undefined,
      hand_grip_id: user_data.hand_grip ?? undefined,
      level_id: user_data.level ?? undefined,
      status: "active",
    },
  });

  const { isLoading, isError, data } = useQuery({
    queryKey: ["location", cep],
    queryFn: async (): Promise<AxiosResponse<Location>> => {
      return await api.get(`https://viacep.com.br/ws/${cep}/json/`);
    },

    enabled: /^\d{8}$/.test(cep),
    select: (data) => {
      return {
        state: data.data.uf,
        city: data.data.localidade,
      };
    },
  });

  const router = useRouter();

  const { mutate, isPending, isError: isEditError } = useEditUser();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let file;
    if (data.image_file && data.image_file.size > 0) {
      if (data.image_file instanceof File) {
        const timestamp = new Date().toISOString();
        const fileExtension = data.image_file.name.split(".").pop();
        file = await handleFileUpload(
          data.image_file,
          `usuarios/imagem-perfil-${timestamp}.${fileExtension}`
        );
        if (user_data.image_url) {
          await deleteFile(user_data.image_url);
        }
      } else file = "";
    } else file = "";

    const { image_file, ...rest } = data;
    const filteredData = { ...rest, image_url: file };

    mutate(
      {
        userId: user_data.id,
        data: {
          name: filteredData.name,
          email: filteredData.email,
          bio: filteredData.bio,
          state: filteredData.state,
          city: filteredData.city,
          instagram: filteredData.instagram,
          image_url: filteredData.image_url,
          status: filteredData.status,
          level_id: filteredData.level_id,
          game_style_id: filteredData.game_style_id,
          hand_grip_id: filteredData.hand_grip_id,
        },
      },
      {
        onSuccess: () => {
          router.push(`/user/${user_data.username}`);
        },
      }
    );
  };

  useEffect(() => {
    form.setValue("city", data?.city);
    form.setValue("state", data?.state);
  }, [data]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 mb-5 container"
      >
        <h1 className="mb-5 font-semibold text-3xl">Edite seu perfil</h1>
        <div className="gap-32 grid grid-cols-2">
          {/* image, name, local and instagram */}
          <div className="flex flex-col gap-3">
            <InputDefault
              control={form.control}
              name="email"
              placeholder="E-mail..."
              type="email"
              label="E-mail cadastrado"
            />
            {user_data.image_url ? (
              <div className="flex items-center gap-3">
                <Image
                  src={user_data.image_url}
                  width={100}
                  height={100}
                  className="border-primary border rounded-full aspect-square"
                  alt="Imagem atual do perfil"
                  priority
                />
                <p className="text-sm leading-4 tracking-tight">
                  Essa é a sua imagem atual. Sinta-se a vontade para realizar o
                  upload de uma nova imagem abaixo.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Image
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user_data.id}`}
                  width={100}
                  height={100}
                  className="border-primary border rounded-full aspect-square"
                  alt="Imagem atual do perfil"
                  unoptimized={true}
                  priority
                />
                <p className="text-sm leading-4 tracking-tight">
                  Você não possui nenhuma imagem cadastrada.{" "}
                  <span className="text-primary">
                    Uma imagem aleatória está sendo usada no lugar.
                  </span>{" "}
                  Sinta-se a vontade para realizar o upload de uma nova imagem
                  abaixo.
                </p>
              </div>
            )}
            <InputImageWithPreview name="image_file" />
            <InputDefault
              control={form.control}
              name="name"
              placeholder="Seu nome..."
              label="Nome"
            />
            <Label>Cidade e estado</Label>
            <div className="flex gap-2 text-sm leading-4 tracking-tight">
              Atual:
              {user_data.city ? (
                <p>
                  {user_data.city} - {user_data.state}
                </p>
              ) : (
                <p>Não informado</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm leading-4 tracking-tight whitespace-nowrap">
                Para alterar esses dados informe um CEP:
              </p>
              <Input
                placeholder="CEP"
                onChange={useDebouncedCallback((event) => {
                  setCep(event.target.value);
                }, 500)}
              />
            </div>
            {cep && /^\d{8}$/.test(cep) ? (
              isLoading ? (
                <p className="text-sm leading-4 tracking-tight">
                  Carregando dados
                </p>
              ) : isError ? (
                <p className="text-sm leading-4 tracking-tight">
                  Ocorreu um erro na busca dos dados
                </p>
              ) : (
                <div className="flex gap-2 text-sm leading-4 tracking-tight">
                  <p>Sua localização será atualizada para:</p>
                  <p>
                    {data?.city} - {data?.state}
                  </p>
                </div>
              )
            ) : null}
            <InputDefault
              control={form.control}
              name="instagram"
              placeholder="instagram"
              label="Instagram"
            />
          </div>
          {/* bio, hand_grip, game_style, level */}
          <div className="flex flex-col gap-3">
            <TextareaDefault
              control={form.control}
              name="bio"
              placeholder="Fale um pouco sobre você..."
              label="Apresentação"
            />
            <Label>Informações do atleta</Label>
            <DefaultCombobox
              control={form.control}
              name="hand_grip_id"
              object={handGrips}
              label="Empunhadura"
              searchLabel="Buscar empunhadura..."
              selectLabel="Empunhadura"
              onSelect={(value: number) => {
                form.setValue("hand_grip_id", value);
              }}
            />
            <DefaultCombobox
              control={form.control}
              name="game_style_id"
              object={gameStyles}
              label="Estilo de jogo"
              searchLabel="Buscar estilo de jogo..."
              selectLabel="Estilo de jogo"
              onSelect={(value: number) => {
                form.setValue("game_style_id", value);
              }}
            />
            <DefaultCombobox
              control={form.control}
              name="level_id"
              object={levels}
              label="Qual seu nível no jogo?"
              searchLabel="Buscar nível..."
              selectLabel="Nível"
              onSelect={(value: number) => {
                form.setValue("level_id", value);
              }}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-destructive"
                onClick={() => setDeleteModal(true)}
              >
                Excluir perfil
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </div>
        </div>

        {deleteModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-background/60">
            <div className="flex flex-col items-center gap-10 border-white bg-modal p-10 border rounded-lg">
              <h1 className="font-semibold text-3xl antialiased tracking-tighter">
                Deseja realmente excluir sua conta?
              </h1>
              <div className="flex gap-10">
                <Image
                  src="/mascot-sad.svg"
                  width={150}
                  height={300}
                  alt="Não vá embora"
                />
                <h3 className="max-w-xs antialiased leading-relaxed tracking-tight">
                  <span className="font-semibold text-primary hover:text-blue-600">
                    Sua compania é muito importante para nós!
                  </span>{" "}
                  Clicando em{" "}
                  <span className="text-red-300 hover:text-red-400">
                    "Excluir"
                  </span>{" "}
                  essa conta será inativada em nosso sistema, seu perfil será
                  desconectado e você será redirecionado para nossa Landing
                  Page.{" "}
                  <span className="text-yellow-100 hover:text-yellow-200">
                    Pensa com carinho, o patola ainda espera viver muitas
                    aventuras ao seu lado.
                  </span>
                </h3>
              </div>
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-destructive"
                  onClick={() => {
                    form.setValue("status", "inactive");
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  Excluir
                </Button>
                <Button type="button" onClick={() => setDeleteModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
