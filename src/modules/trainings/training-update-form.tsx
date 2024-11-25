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
import { Training } from "@/interfaces/training";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Reorder } from "motion/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TrainingResponse {
  training: Training;
}

interface TrainingItem {
  comments: string;
  counting_mode: "time" | "reps";
  movement: {
    average_time: number;
    description: string;
    image_url: string;
    name: string;
    video_url: string;
  };
  queue: number;
  reps: number;
  time: number;
}

interface Item {
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
        id: z.number().optional(),
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

  const levels: Item[] = combobox_data?.levels.levels
    .map((level: ComboboxOption) => ({
      value: level.id,
      label: level.title,
    }))
    .filter((level: Item) => level.label !== "Livre");

  const visibilityTypes: Item[] =
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
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
            <h1>Página para edição de treino: {training_id}</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-11"
              >
                <ScrollArea className="border-input col-span-5 p-4 border rounded-sm">
                  <Reorder.Group
                    values={trainingItems}
                    onReorder={setTrainingItems}
                  >
                    {trainingItems.map((trainingItem) => (
                      <Reorder.Item
                        key={trainingItem.queue}
                        value={trainingItem}
                        className="cursor-grab"
                      >
                        <div className="flex gap-2 border-primary border">
                          <p>{trainingItem.movement.name}</p>
                          <p>{trainingItem.queue}</p>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </ScrollArea>
                <Separator
                  orientation="vertical"
                  className="col-span-1 bg-primary m-auto"
                />
                <div className="col-span-5">
                  <div className="gap-3 grid grid-cols-2">
                    <div>
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
                      labelClassname="w-full h-full aspect-square"
                    />
                  </div>
                  <TextareaDefault
                    control={form.control}
                    name="description"
                    placeholder="Descrição"
                  />
                </div>
              </form>
            </Form>
          </div>
        </>
      )}
    </>
  );
}
