"use client";

import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { useEditStrategy, useStrategyById } from "@/hooks/use-strategies";
import MovementsForChoose from "@/components/movements-for-choose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import DefaultCombobox from "@/components/form/combobox-default";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import Loading from "@/app/loading";
import { useLevelsData, useVisibilityTypesData } from "@/hooks/use-auxiliaries";
import { ComboboxItem, ComboboxOption } from "@/interfaces/level";
import { FaSpinner } from "react-icons/fa";
import { StrategyItem } from "@/interfaces/strategy";
import RelateMovementModal from "./relate-movement-modal";
import { Movement } from "@/interfaces/training";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import RelateMovementCard from "./relate-movement-card";

const FormSchema = z.object({
  title: z.string().min(1),
  against_whom: z
    .string()
    .min(1, { message: "Ao mínimo 1 caractere é necessário" }),
  how_it_works: z.string(),
  icon_file: z.instanceof(File),
  level_id: z.number(),
  visibility_type_id: z.number(),
});

export default function StrategyUpdateForm() {
  const [strategyItems, setStrategyItems] = useState<StrategyItem[]>([]);

  const session = useSession();
  const user_id = session.data?.payload.sub;
  const username = session.data?.payload.username;

  const params = useParams();
  const strategy_id = params.strategy_id.toLocaleString();

  const { data, isLoading, isError } = useStrategyById(strategy_id);

  isLoading && <Loading />;
  isError && <p>Ocorreu um erro ao carregar os dados da estratégia</p>;

  const strategy = data?.strategy;

  const levelsData = useLevelsData().data?.levels ?? [];

  const visibilityTypesData =
    useVisibilityTypesData().data?.visibilityTypes ?? [];

  const levels: ComboboxItem[] = levelsData
    .map((level: ComboboxOption) => ({
      value: level.id,
      label: level.title,
    }))
    .filter((level: ComboboxItem) => level.label !== "Livre");

  const visibilityTypes: ComboboxItem[] = visibilityTypesData.map(
    (visibilityType: Partial<ComboboxOption>) => ({
      value: visibilityType.id,
      label: visibilityType.description,
    })
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      against_whom: "",
      how_it_works: "",
      icon_file: new File([], ""),
      level_id: undefined,
      visibility_type_id: undefined,
    },
  });

  const addNewStrategyItem = (movement: Movement, description: string) => {
    const addNewStrategyItem = {
      description: description,
      movement: movement,
    };

    setStrategyItems([...strategyItems, addNewStrategyItem]);
  };

  const router = useRouter();

  const { mutate, isPending, isError: isEditError } = useEditStrategy();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!strategy) return;

    let file;
    if (data.icon_file && data.icon_file.size > 0) {
      if (data.icon_file instanceof File) {
        const timestamp = new Date().toISOString();
        const file_extension = data.icon_file.name.split(".").pop();
        file = await handleFileUpload(
          data.icon_file,
          `estrategias/icone-representacao-${timestamp}.${file_extension}`
        );
        if (strategy.icon_url) {
          deleteFile(strategy.icon_url);
        }
      } else file = "";
    } else file = "";

    const { icon_file, ...rest } = data;

    const updatedStrategyItems = strategyItems.map(({ movement, ...rest }) => ({
      ...rest,
      movement_id: movement.id,
    }));

    const filteredData = {
      ...rest,
      ...(file && { icon_url: file }),
      items: updatedStrategyItems,
    };

    const strategyData = {
      strategyId: strategy.id,
      data: {
        title: filteredData.title,
        how_it_works: filteredData.how_it_works,
        against_whom: filteredData.against_whom,
        ...(file && { icon_url: filteredData.icon_url }),
        user_id: user_id,
        level_id: filteredData.level_id,
        visibility_type_id: filteredData.visibility_type_id,
        items: filteredData.items,
      },
    };

    mutate(strategyData, {
      onSuccess: () => {
        router.push(`/strategies/${strategy.id}`);
      },
    });
  };

  useEffect(() => {
    if (strategy?.strategy_items) {
      setStrategyItems(strategy.strategy_items);
      form.reset(strategy);
    }
  }, [strategy]);

  if (!strategy) return;

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-12 mt-5 mb-5 container">
        {/* Formulário */}
        <div className="space-y-3 col-span-7">
          <div className="flex items-center gap-3 font-semibold text-4xl">
            <Strategy />
            Edite sua estratégia
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2">
                <div className="flex-1 space-y-4">
                  <InputDefault
                    control={form.control}
                    name="title"
                    label="Título"
                    placeholder="Título da estratégia"
                  />
                  <DefaultCombobox
                    control={form.control}
                    name="visibility_type_id"
                    object={visibilityTypes}
                    label="Visibilidade da estratégia"
                    searchLabel="Buscar visibilidade..."
                    selectLabel="Visibilidade"
                    onSelect={(value: number) => {
                      form.setValue("visibility_type_id", value);
                    }}
                  />
                  <DefaultCombobox
                    control={form.control}
                    name="level_id"
                    object={levels}
                    label="Nível da estratégia"
                    searchLabel="Buscar nível..."
                    selectLabel="Nível"
                    onSelect={(value: number) => {
                      form.setValue("level_id", value);
                    }}
                  />
                </div>

                <div className="flex flex-col justify-between mx-auto">
                  <Label>Ícone</Label>
                  <InputImageWithPreview
                    image_url={strategy.icon_url}
                    name="icon_file"
                    formItemClassname="hidden"
                    parentClassname="w-44"
                    labelClassname="w-44 h-full aspect-square"
                  />
                </div>
              </div>
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
                className="resize-none"
              />
              {strategyItems.length > 0 ? (
                <div className="space-y-3">
                  <Label>Movimentos relacionados</Label>
                  <ScrollArea className="border-input px-4 py-2 border rounded-md h-20">
                    <div className="flex flex-col gap-2">
                      {strategyItems.map((strategyItem) => {
                        return (
                          <div
                            key={strategyItem.movement?.id}
                            className="flex justify-between items-center gap-2 px-4 py-2 border border-border rounded"
                          >
                            {strategyItem.movement?.name}
                            <Button
                              variant={"secondary"}
                              onClick={() => {
                                const newItemsList = strategyItems.filter(
                                  (itemInList) =>
                                    itemInList.movement?.id !==
                                    strategyItem.movement?.id
                                );
                                setStrategyItems(newItemsList);
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
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => router.back()}
                >
                  Esquece, tava legal.
                </Button>
                <Button type="submit" disabled={isPending ? true : false}>
                  {isPending ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Salvando
                    </>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>
              </div>
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
          scrollAreaClassname="h-[600px]"
          parentClassname="col-span-4 flex flex-col items-center gap-3"
          movement_card={(move) => {
            return (
              <RelateMovementCard
                strategyItems={strategyItems}
                movement={move}
                addNewStrategyItem={addNewStrategyItem}
              />
            );
          }}
        />
      </div>
    </>
  );
}
