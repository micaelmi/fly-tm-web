"use client";

import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
import MovementsForChoose from "@/components/movements-for-choose";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCreateStrategy } from "@/hooks/use-strategies";
import { useGetUserClubId } from "@/hooks/use-users";
import { StrategyItem } from "@/interfaces/strategy";
import { Movement } from "@/interfaces/training";
import { handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Strategy, TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FinishingStrategyModal from "./finishing-strategy-modal";
import RelateMovementCard from "./relate-movement-card";

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
});

export default function StrategyRegisterForm() {
  const [strategyItems, setStrategyItems] = useState<StrategyItem[]>([]);

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
    },
  });

  const addNewStrategyItem = (movement: Movement, description: string) => {
    const addNewStrategyItem = {
      description: description,
      movement: movement,
    };

    setStrategyItems([...strategyItems, addNewStrategyItem]);
  };

  const hasClub = useGetUserClubId();

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

    const updatedStrategyItems = strategyItems.map(({ movement, ...rest }) => ({
      ...rest,
      movement_id: movement.id,
    }));

    const filteredData = {
      ...rest,
      icon_url: file,
      strategyItems: updatedStrategyItems,
    };

    mutate(
      {
        title: filteredData.title,
        how_it_works: filteredData.how_it_works,
        against_whom: filteredData.against_whom,
        icon_url: filteredData.icon_url ?? "",
        user_id: user_id ?? "",
        level_id: filteredData.level_id,
        visibility_type_id: filteredData.visibility_type_id,
        club_id: filteredData.visibility_type_id === 3 ? hasClub : undefined,
        items: filteredData.strategyItems,
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
                  variant={"outline"}
                  type="button"
                  onClick={() => {
                    router.push("/strategies");
                  }}
                >
                  Cancelar
                </Button>
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
                closeFinishingStrategyModal={() => {
                  form.setValue("icon_file", new File([], ""));
                  setIsFinishingStrategyModalOpen(false);
                }}
                hasClub={hasClub}
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
