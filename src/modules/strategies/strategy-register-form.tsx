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

const FormSchema = z.object({
  against_whom: z
    .string()
    .min(1, { message: "Ao mínimo 1 caractere é necessário" }),
  how_it_works: z.string(),
  icon_file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Selecione um ícone" }),
  // user_id: z.string().uuid(),
  level_id: z.number(),
  visibility_type_id: z.number(),
  club_id: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string(),
      movement_id: z.number(),
    })
  ),
});

export default function StrategyRegisterForm() {
  const [movesForChoose, setMovesForChoose] = useState([
    {
      movement_id: 1,
      movement_description: "Drive",
      movement_image_url: "/mascot-hitting.svg",
    },
    {
      movement_id: 2,
      movement_description: "Chiquita",
      movement_image_url: "/mascot-hitting.svg",
    },
    {
      movement_id: 3,
      movement_description: "Backend",
      movement_image_url: "/mascot-hitting.svg",
    },
  ]);
  const [finishingStrategyModal, setFinishingStrategyModal] = useState({
    isOpen: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      against_whom: "",
      how_it_works: "",
      icon_file: new File([], ""),
      // user_id: "",
      level_id: undefined,
      visibility_type_id: undefined,
      club_id: "",
      items: [],
    },
  });
  const items = form.watch("items");

  const closeFinishingStrategyModal = (open: boolean) => {
    setFinishingStrategyModal({
      ...finishingStrategyModal,
      isOpen: open,
    });
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Foi para envio");

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
    console.log(filteredData);
  };
  return (
    <>
      <Navbar />
      <div className="flex mt-5 mb-5 container">
        {/* Formulário */}
        <div>
          <div className="flex items-center gap-3 font-semibold text-4xl">
            <Strategy />
            Elabore uma estratégia
          </div>
          <p>
            Ao lado, caso deseje, escolha movimentos coerentes à estratégia
            elaborada e relacione-os
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <>
                  <Label>Movimentos relacionados</Label>
                  <ScrollArea>
                    <div className="flex flex-col gap-2">
                      {items.map((item) => {
                        return (
                          <div
                            key={item.movement_id}
                            className="flex items-center gap-2 p-2 border border-border rounded"
                          >
                            {item.movement_id}
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
                              className="bg-transparent p-0 h-fit text-primary"
                            >
                              <TrashSimple />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </>
              ) : null}
              <div className="flex justify-between">
                <Button variant={"outline"}>Cancelar</Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFinishingStrategyModal({
                      ...finishingStrategyModal,
                      isOpen: true,
                    })
                  }
                >
                  Continuar
                </Button>
              </div>
              {/* Modal para finalização da estratégia */}
              <FinishingStrategyModal
                isOpen={finishingStrategyModal.isOpen}
                closeFinishingStrategyModal={closeFinishingStrategyModal}
              />
            </form>
          </Form>
        </div>
        <Separator orientation="vertical" />
        {/* Movimentos para relação */}
        <div>
          <h1>Movimentos</h1>
          <Search pagination={false} placeholder="Buscar..." />
          {movesForChoose.map((move) => {
            return (
              <div key={move.movement_id}>
                {move.movement_id}
                <div>
                  {move.movement_description}
                  <Question />
                </div>
                <Image
                  src={move.movement_image_url}
                  width={100}
                  height={100}
                  className="aspect-square"
                  alt="Imagem do movimento"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (
                      items.some(
                        (item) => item.movement_id === move.movement_id
                      )
                    ) {
                      alert("O item selecionado já está relacionado.");
                    } else {
                      const newItem = {
                        movement_id: move.movement_id,
                        description: move.movement_description,
                      };
                      form.setValue("items", [...items, newItem]);
                    }
                  }}
                >
                  Relacionar
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
