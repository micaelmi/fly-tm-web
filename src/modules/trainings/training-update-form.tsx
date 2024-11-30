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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TrainingItemCard from "./training-item-card";
import { Button } from "@/components/ui/button";
import AddTrainingItemModal from "./add-training-item-modal";
import PageTitleWithIcon from "@/components/page-title-with-icon";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import { createUniqueIdGenerator, formatTime } from "@/lib/utils";
import { useEditTraining } from "@/hooks/use-trainings";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { FaSpinner } from "react-icons/fa";
import { ComboboxItem, ComboboxOption } from "@/interfaces/level";

interface TrainingResponse {
  training: Training;
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
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([]);

  const params = useParams();

  const session = useSession().data;

  const token = session?.token.user.token;

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
    changeTime([...trainingItems, newItem]);
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
    changeTime(updatedTrainingItems);
  };

  const onReorder = (newTrainingItemsList: TrainingItem[]) => {
    const updatedTrainingItems = changeQueue(newTrainingItemsList);

    setTrainingItems(updatedTrainingItems);
  };

  const changeTime = (items: TrainingItem[]) => {
    let time = 0;

    items.forEach((item) => {
      if (item.movement.average_time) {
        if (item.reps) {
          time += item.reps * item.movement.average_time;
        } else if (item.time) {
          time += item.time;
        }
      }
    });

    setEstimatedTime(time);
  };

  const changeQueue = (items: TrainingItem[]) => {
    return items.map((item, index) => ({
      ...item,
      queue: index + 1,
    }));
  };

  const router = useRouter();

  const { mutate, isPending, isError: isEditError } = useEditTraining();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!training) return;
    let file;
    if (data.icon_file && data.icon_file.size > 0) {
      if (data.icon_file instanceof File) {
        const timestamp = new Date().toISOString();
        const file_extension = data.icon_file.name.split(".").pop();
        file = await handleFileUpload(
          data.icon_file,
          `treinos/icone-representacao-${timestamp}.${file_extension}`
        );
        if (training.icon_url) {
          deleteFile(training.icon_url);
        }
      } else file = "";
    } else file = "";

    const { icon_file, ...rest } = data;

    const updatedTrainingItems = trainingItems.map(
      ({ id, movement, ...rest }) => ({
        ...rest,
        movement_id: movement.id, // Adiciona a nova propriedade com o valor de movement.id
      })
    );

    const filteredData = {
      ...rest,
      ...(file && { icon_url: file }),
      items: updatedTrainingItems,
    };

    const trainingData = {
      trainingId: training.id,
      data: {
        title: filteredData.title,
        description: filteredData.description,
        time: estimatedTime,
        ...(file && { icon_url: filteredData.icon_url }),
        level_id: filteredData.level_id,
        visibility_type_id: filteredData.visibility_type_id,
        items: filteredData.items,
      },
    };

    mutate(trainingData, {
      onSuccess: () => {
        router.push(`/trainings/${training.id}`);
      },
    });
  };

  useEffect(() => {
    if (training?.training_items) {
      setTrainingItems(training.training_items);
      setEstimatedTime(training.time);
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
                    <div className="space-y-4">
                      <p className="bg-secondary px-2 rounded-lg w-fit">
                        Tempo estimado para conclusão do treino:{" "}
                        <span className="font-semibold">
                          {formatTime(estimatedTime)}
                        </span>
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">
                          Movimentos: {trainingItems.length}
                        </p>
                        <AddTrainingItemModal
                          addNewTrainingItem={addNewTrainingItem}
                        />
                      </div>
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
                        image_url={training.icon_url}
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
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => router.back()}
                  >
                    Esquece, tava legal.
                  </Button>
                  <Button disabled={isPending ? true : false}>
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
        </>
      )}
    </>
  );
}
