"use client";

import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Question,
  Strategy,
  TrashSimple,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FinishingStrategyModal from "./finishing-strategy-modal";
import { handleFileUpload } from "@/lib/firebase-upload";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { useCreateStrategy } from "@/hooks/use-strategies";
import MovementsForChoose from "@/components/movements-for-choose";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  title: z.string().min(1),
  against_whom: z
    .string()
    .min(1, { message: "Ao mínimo 1 caractere é necessário" }),
  how_it_works: z.string(),
  icon_file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Selecione um ícone" }),
  level_id: z.number(),
  visibility_type_id: z.number(),
  items: z.array(
    z.object({
      description: z.string(),
      movement_id: z.number(),
    })
  ),
});

export default function StrategyRegisterForm() {
  const user_id = useSession().data?.payload.sub;

  const [isFinishingStrategyModalOpen, setIsFinishingStrategyModalOpen] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      against_whom: "",
      how_it_works: "",
      icon_file: new File([], ""),
      level_id: undefined,
      visibility_type_id: undefined,
      items: [],
    },
  });
  const items = form.watch("items");

  const router = useRouter();

  const { mutate, isPending, isError, error } = useCreateStrategy();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let file;
    if (data.icon_file && data.icon_file.size > 0) {
      if (data.icon_file instanceof File) {
        const timestamp = new Date().toISOString();
        const file_extension = data.icon_file.name.split(".").pop();
        file = await handleFileUpload(
          data.icon_file,
          `estrategias/icone-representacao-${timestamp}.${file_extension}`
        );
      } else file = "";
    } else file = "";

    const { icon_file, ...rest } = data;
    const filteredData = { ...rest, icon_url: file };

    mutate(
      {
        title: filteredData.title,
        how_it_works: filteredData.how_it_works,
        against_whom: filteredData.against_whom,
        icon_url: filteredData.icon_url ?? "",
        user_id: user_id ?? "",
        level_id: filteredData.level_id,
        visibility_type_id: filteredData.visibility_type_id,
        items: filteredData.items,
      },
      {
        onSuccess: () => {
          router.push("/strategies");
        },
      }
    );
  };
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-12 mt-5 mb-5 container">
        {/* Formulário */}
        <div className="space-y-3 col-span-7">
          <div className="flex items-center gap-3 font-semibold text-4xl">
            <Strategy />
            Elabore uma estratégia
          </div>
          <p className="">
            Ao lado, caso deseje, escolha movimentos coerentes à estratégia
            elaborada e <span className="text-primary">relacione-os</span>.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <InputDefault
                control={form.control}
                name="against_whom"
                label="Contra quem?"
                placeholder="Contra qual tipo de jogador essa estratégia é interessante?"
              />
              <TextareaDefault
                control={form.control}
                name="how_it_works"
                label="Como funciona?"
                placeholder="Descreva quais movimentos devem ser usados e em qual sequência. Considerando também destacar os contextos apropriados para o uso dessa estratégia."
              />
              {items.length > 0 ? (
                <div className="space-y-3">
                  <Label>Movimentos relacionados</Label>
                  <ScrollArea>
                    <div className="flex flex-col gap-2">
                      {items.map((item) => {
                        return (
                          <div
                            key={item.movement_id}
                            className="flex justify-between items-center gap-2 px-4 py-2 border border-border rounded"
                          >
                            {item.description}
                            <Button
                              variant={"secondary"}
                              onClick={() => {
                                const newItemsList = items.filter(
                                  (itemInList) =>
                                    itemInList.movement_id !== item.movement_id
                                );
                                form.setValue("items", newItemsList);
                              }}
                              type="button"
                              className="bg-transparent p-1 h-fit text-primary"
                            >
                              <TrashSimple />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              ) : null}
              <div className="flex justify-between">
                <Button variant={"outline"}>Cancelar</Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (
                      form.getValues("against_whom") === "" ||
                      form.getValues("how_it_works") === ""
                    ) {
                      alert(
                        "Preecha todos os campos dessa sessão antes de continuar."
                      );
                      return;
                    }
                    setIsFinishingStrategyModalOpen(true);
                  }}
                >
                  Continuar
                </Button>
              </div>
              {/* Modal para finalização da estratégia */}
              <FinishingStrategyModal
                isPending={isPending}
                isError={isError}
                error={error}
                isOpen={isFinishingStrategyModalOpen}
                closeFinishingStrategyModal={() =>
                  setIsFinishingStrategyModalOpen(false)
                }
              />
            </form>
          </Form>
        </div>
        <Separator
          orientation="vertical"
          className="col-span-1 bg-primary shadow shadow-primary m-auto"
        />
        {/* Movimentos para relação */}
        <MovementsForChoose
          h1Classname="text-3xl font-bold"
          parentClassname="col-span-4 flex flex-col items-center gap-3"
          movement_card={(move) => {
            return (
              <div
                key={move.id}
                className="flex flex-col gap-2 border-primary p-2 border rounded-lg"
              >
                <div className="flex justify-between items-center font-semibold">
                  {move.name}
                  <Question size={21} />
                </div>
                <Image
                  src={move.image_url}
                  className="w-full"
                  width={100}
                  height={100}
                  alt="Imagem do movimento"
                  priority
                />
                <button
                  type="button"
                  onClick={() => {
                    if (items.some((item) => item.movement_id === move.id)) {
                      alert("O item selecionado já está relacionado.");
                    } else {
                      const newItem = {
                        movement_id: move.id,
                        description: move.name,
                      };
                      form.setValue("items", [...items, newItem]);
                    }
                  }}
                  className="hover:bg-secondary hover:rounded-lg text-primary transition-all"
                >
                  Relacionar
                </button>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
