"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateTraining } from "@/hooks/use-trainings";
import { handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import DefaultCombobox from "@/components/form/combobox-default";
import { Form } from "@/components/ui/form";
import InputDefault from "@/components/form/input-default";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import { FaSpinner } from "react-icons/fa";
import { Clock, Flag } from "@phosphor-icons/react/dist/ssr";
import { formatTime } from "@/lib/utils";
import { TrainingItem } from "@/interfaces/training";
import { useLevelsData, useVisibilityTypesData } from "@/hooks/use-auxiliaries";
import { ComboboxItem, ComboboxOption } from "@/interfaces/level";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface FinishingTrainingModalProps {
  trainingItems: TrainingItem[];
  description: string;
  closeFinishinTrainingModal: () => void;
}

interface Level {
  value: number;
  label: string;
  description: string;
}

const FormSchema = z.object({
  title: z.string().min(1, { message: "Ao mínimo 1 caractere é necessário" }),
  icon_file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Selecione uma imagem" }),
  level_id: z.number(),
  visibility_type_id: z.number(),
});

export default function FinishingTrainingModal({
  trainingItems,
  description,
  closeFinishinTrainingModal,
}: FinishingTrainingModalProps) {
  const { data: session } = useSession();
  const user_id = session?.payload.sub;

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

  const estimated_time_to_finish_training = () => {
    let time = 0;
    trainingItems.forEach((item) => {
      if (item.time) {
        time += item.time;
      } else if (item.reps && item.movement.average_time) {
        time += item.reps * item.movement.average_time;
      }
    });

    return time;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "Treino sem título",
      icon_file: new File([], ""),
      level_id: undefined,
      visibility_type_id: undefined,
    },
  });

  const errors = form.formState.errors;

  const router = useRouter();

  const { mutate, isPending, isError, error } = useCreateTraining();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let file;
    if (data.icon_file && data.icon_file.size > 0) {
      if (data.icon_file instanceof File) {
        const timestamp = new Date().toISOString();
        const file_extension = data.icon_file.name.split(".").pop();
        file = await handleFileUpload(
          data.icon_file,
          `treinos/icone-representacao-${timestamp}.${file_extension}`
        );
      } else file = "";
    } else file = "";
    const { icon_file, ...rest } = data;
    const filteredData = { ...rest, icon_url: file };

    const updatedTrainingItems = trainingItems.map(
      ({ id, movement, ...rest }) => {
        if (!movement?.id) {
          throw new Error(
            `Movement ID is missing for training item with ID ${id}`
          );
        }

        return {
          ...rest,
          movement_id: movement.id,
        };
      }
    );

    mutate(
      {
        title: filteredData.title,
        description: description,
        time: estimated_time_to_finish_training(),
        icon_url: filteredData.icon_url,
        user_id: user_id,
        level_id: filteredData.level_id,
        visibility_type_id: filteredData.visibility_type_id,
        club_id: undefined,
        items: updatedTrainingItems,
      },
      {
        onSuccess: () => {
          router.push("/home");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-background/60">
      <div className="border-white bg-modal px-8 py-4 border rounded-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="flex justify-center items-center gap-3 mb-3">
              <div>
                {/* level */}
                <div className="flex items-center gap-2 w-full text-primary">
                  <Flag />
                  <DefaultCombobox
                    control={form.control}
                    name="level_id"
                    object={levels}
                    searchLabel="Buscar nível..."
                    selectLabel="Selecione o nível do treino"
                    buttonVariant="ghost"
                    onSelect={(value: number) => {
                      form.setValue("level_id", value);
                    }}
                    className="flex gap-2 p-0"
                  />
                </div>

                {/* title */}
                <InputDefault
                  control={form.control}
                  name="title"
                  placeholder="Título do treino"
                  inputClassname="border-none text-xl font-semibold p-0"
                  className="mb-5"
                />

                <div className="flex flex-col font-semibold">
                  <p>Tempo estimado</p>
                  <p className="flex items-center gap-2 text-lg">
                    <Clock /> {formatTime(estimated_time_to_finish_training())}
                  </p>
                </div>
              </div>

              <InputImageWithPreview
                name="icon_file"
                formItemClassname="hidden"
                parentClassname="w-32 h-32"
                labelClassname="w-32 h-32"
              />
            </div>

            {/* visibility */}
            <DefaultCombobox
              control={form.control}
              name="visibility_type_id"
              object={visibilityTypes}
              label="Visibilidade do treino"
              searchLabel="Buscar..."
              selectLabel="Visibilidade"
              onSelect={(value: number) => {
                form.setValue("visibility_type_id", value);
              }}
            />

            {Object.keys(errors).length > 0 && (
              <div className="border-destructive mt-4 mb-3 p-2 border rounded-lg text-destructive">
                <h3 className="font-semibold">Erros de Validação:</h3>
                <ul>
                  {Object.entries(errors).map(([key, error]) => {
                    return (
                      <li key={key} className="text-sm">
                        {error?.message && typeof error.message === "string"
                          ? error.message
                          : "Erro desconhecido"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* error message */}
            {isError ? (
              <p className="border-destructive border text-destructive">
                {error.message}
              </p>
            ) : null}

            {/* buttons */}
            <div className="flex justify-between mt-2">
              <Button
                type="button"
                onClick={() => {
                  form.setValue("icon_file", new File([], ""));
                  closeFinishinTrainingModal();
                }}
                className="bg-transparent hover:bg-transparent p-0 text-primary hover:text-primary/60 underline"
              >
                Voltar
              </Button>
              <Button type="submit">
                {isPending ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Criando
                  </>
                ) : (
                  "Criar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
