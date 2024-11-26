"use client";

import Loading from "@/app/loading";
import DefaultCombobox from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import TextareaDefault from "@/components/form/textarea-default";
import Navbar from "@/components/navbar";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Training, TrainingItem } from "@/interfaces/training";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Reorder } from "motion/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TrainingItemCard from "./training-item-card";
import { Button } from "@/components/ui/button";
import AddTrainingItemModal from "./add-training-item-modal";
import { Item } from "./training-register-form";
import PageTitleWithIcon from "@/components/page-title-with-icon";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import { createUniqueIdGenerator } from "@/lib/utils";

interface TrainingResponse {
  training: Training;
}

interface ComboboxItem {
  value: number;
  label: string;
}

interface ComboboxOption {
  id: number;
  title: string;
  description: string;
}

const FormSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon_file: z.instanceof(File),
  level_id: z.number().optional(),
  visibility_type_id: z.number().optional(),
  items: z
    .array(
      z.object({
        counting_mode: z.enum(["reps", "time"]),
        reps: z.number(),
        time: z.number(),
        queue: z.number(),
        comments: z.string(),
        movement_id: z.number(),
      })
    )
    .optional(),
});

export default function TrainingUpdateForm() {
  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([]);

  const params = useParams();

  const token = useSession().data?.token.user.token;
  const training_id = params.training_id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["trainingData", training_id],
    queryFn: async () => {
      return await api.get<TrainingResponse>(`/trainings/${training_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
  });

  isLoading && <Loading />;
  isError && <p>Ocorreu um erro ao carregar os dados do treino</p>;

  const training = data?.data.training;

  const {
    data: combobox_data,
    isLoading: combobox_isLoading,
    error: combobox_error,
  } = useQuery({
    queryKey: ["levelsData", "visibilityTipesData"],
    queryFn: async () => {
      const [levels, visibility_types] = await Promise.all([
        api.get("/levels", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get("/visibility-types", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      return {
        levels: levels.data,
        visibility_types: visibility_types.data,
      };
    },
    enabled: !!token,
  });

  const levels: ComboboxItem[] = combobox_data?.levels.levels
    .map((level: ComboboxOption) => ({
      value: level.id,
      label: level.title,
    }))
    .filter((level: ComboboxItem) => level.label !== "Livre");

  const visibilityTypes: ComboboxItem[] =
    combobox_data?.visibility_types.visibilityTypes.map(
      (visibilityType: Partial<ComboboxOption>) => ({
        value: visibilityType.id,
        label: visibilityType.description,
      })
    );

  const movementsData = useQuery({
    queryKey: ["movementsData"],
    queryFn: async () => {
      return await api.get("/movements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
  });

  const movementsForChoose = movementsData.data?.data.movements;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      icon_file: new File([], ""),
      level_id: 0,
      visibility_type_id: 0,
      items: [],
    },
  });

  const addNewTrainingItem = (data: TrainingItem) => {
    const newItem = {
      ...data,
      queue: trainingItems.length + 1,
    };

    setTrainingItems([...trainingItems, newItem]);
  };

  const removeTrainingItem = (queue: number) => {
    if (trainingItems.length === 1) {
      alert("Um treino precisa ter ao menos um movimento!");
      return;
    }

    let updatedTrainingItems = trainingItems.filter((trainingItem) => {
      return trainingItem.queue !== queue;
    });

    updatedTrainingItems = changeQueue(updatedTrainingItems);

    if (updatedTrainingItems) setTrainingItems(updatedTrainingItems);
  };

  const onReorder = (newTrainingItemsList: TrainingItem[]) => {
    const updatedTrainingItems = changeQueue(newTrainingItemsList);

    setTrainingItems(updatedTrainingItems);
  };

  const changeQueue = (items: TrainingItem[]) => {
    return items.map((item, index) => ({
      ...item,
      queue: index + 1,
    }));
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("submit errado");
    console.log(data);
  };

  useEffect(() => {
    if (training?.training_items) {
      setTrainingItems(training.training_items);
      form.reset(training);
    }
  }, [training]);

  if (!training) return <Loading />;

  return (
    <>
      {combobox_isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <div className="mt-5 mb-5 container">
            <PageTitleWithIcon
              title="Edite seu treino"
              icon={Barbell}
              parentClassname="mb-3"
            />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-11">
                  <div className="flex flex-col gap-1 col-span-5">
                    <p className="mb-2">
                      Abaixo está a relação de itens desse treino.{" "}
                      <span className="text-primary">
                        Você pode ajustar a ordem de execução desses itens
                        arrastando-os
                      </span>
                      .
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        Movimentos: {trainingItems.length}
                      </p>
                      <AddTrainingItemModal
                        movementsForChoose={movementsForChoose}
                        addNewTrainingItem={addNewTrainingItem}
                      />
                    </div>
                    <ScrollArea className="border-input p-4 border rounded-sm h-96">
                      <Reorder.Group
                        values={trainingItems}
                        onReorder={(newTrainingItemsList) =>
                          onReorder(newTrainingItemsList)
                        }
                        className="flex flex-col gap-2"
                      >
                        {trainingItems.map((trainingItem) => (
                          <Reorder.Item
                            key={trainingItem.id}
                            value={trainingItem}
                            className="cursor-grab"
                          >
                            <TrainingItemCard
                              image_url={trainingItem.movement.image_url}
                              reps={trainingItem.reps}
                              time={trainingItem.time}
                              name={trainingItem.movement.name}
                              removeItem={() =>
                                removeTrainingItem(trainingItem.queue)
                              }
                            />
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </ScrollArea>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="col-span-1 bg-primary m-auto"
                  />
                  <div className="flex flex-col gap-3 col-span-5 h-96">
                    <div className="items-end gap-3 grid grid-cols-2">
                      <div className="space-y-3">
                        <InputDefault
                          control={form.control}
                          name="title"
                          label="Título"
                          placeholder="Título do treino"
                        />
                        <DefaultCombobox
                          control={form.control}
                          name="visibility_type_id"
                          object={visibilityTypes}
                          label="Visibilidade do treino"
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
                          label="Nível do treino"
                          searchLabel="Buscar nível..."
                          selectLabel="Nível"
                          onSelect={(value: number) => {
                            form.setValue("level_id", value);
                          }}
                        />
                      </div>
                      <InputImageWithPreview
                        name="icon_file"
                        formItemClassname="hidden"
                        parentClassname="aspect-square"
                        labelClassname="w-full h-full aspect-square"
                      />
                    </div>
                    <TextareaDefault
                      control={form.control}
                      name="description"
                      placeholder="Descrição"
                      className="resize-none"
                      rows={10}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <Button variant={"outline"}>Esquece, tava legal.</Button>
                  <Button>Salvar alterações</Button>
                </div>
              </form>
            </Form>
          </div>
        </>
      )}
    </>
  );
}
