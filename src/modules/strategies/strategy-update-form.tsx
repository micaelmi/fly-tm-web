"use client";

import Loading from "@/app/loading";
import DefaultCombobox from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import TextareaDefault from "@/components/form/textarea-default";
import MovementsForChoose from "@/components/movements-for-choose";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLevelsData, useVisibilityTypesData } from "@/hooks/use-auxiliaries";
import { useEditStrategy, useStrategyById } from "@/hooks/use-strategies";
import { useGetUserClubId } from "@/hooks/use-users";
import { ComboboxItem, ComboboxOption } from "@/interfaces/level";
import { StrategyItem } from "@/interfaces/strategy";
import { Movement } from "@/interfaces/training";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Strategy, TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
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
  const params = useParams();
  const strategy_id = params.strategy_id.toLocaleString();

  const { data, isLoading, isError } = useStrategyById(strategy_id);
  const levelsData = useLevelsData().data?.levels ?? [];
  const visibilityTypesData =
    useVisibilityTypesData().data?.visibilityTypes ?? [];
  const { mutate, isPending, isError: isEditError } = useEditStrategy();
  const hasClub = useGetUserClubId();

  const router = useRouter();

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

  useEffect(() => {
    if (data?.strategy.strategy_items) {
      setStrategyItems(data?.strategy.strategy_items);
      form.reset(data?.strategy);
    }
  }, [data?.strategy]);

  isLoading && <Loading />;
  isError && <p>Ocorreu um erro ao carregar os dados da estratégia</p>;

  const strategy = data?.strategy;

  const levels: ComboboxItem[] = levelsData
    .map((level: ComboboxOption) => ({
      value: level.id,
      label: level.title,
    }))
    .filter((level: ComboboxItem) => level.label !== "Livre");

  let visibilityTypes: ComboboxItem[];

  if (hasClub) {
    visibilityTypes = visibilityTypesData.map(
      (visibilityType: Partial<ComboboxOption>) => ({
        value: visibilityType.id,
        label: visibilityType.description,
      })
    );
  } else {
    visibilityTypes = visibilityTypesData
      .map((visibilityType: Partial<ComboboxOption>) => ({
        value: visibilityType.id,
        label: visibilityType.description,
      }))
      .filter((visibilityType) => visibilityType.label !== "Apenas clube");
  }

  const addNewStrategyItem = (movement: Movement, description: string) => {
    const addNewStrategyItem = {
      description: description,
      movement: movement,
    };

    setStrategyItems([...strategyItems, addNewStrategyItem]);
  };

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
        club_id: filteredData.visibility_type_id === 3 ? hasClub : undefined,
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

  if (!strategy) return <Loading />;

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
                key={move.id}
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
