import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import InputDefault from "./form/input-default";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputImage from "./form/input-image";
import { handleFileUpload } from "@/lib/firebase-upload";
import DefaultCombobox from "./form/combobox-default";
import { FormEvent, useState } from "react";
import { Item } from "@/modules/trainings/training-register-form";

interface FinishingTrainingModalProps {
  items: Item[];
  closeFinishinTrainingModal: () => void;
}

interface Level {
  value: number;
  label: string;
  description: string;
}

const FormSchema = z.object({
  title: z.string().min(1, { message: "Ao mínimo 1 caractere é necessário" }),
  time: z.coerce.number(),
  icon_file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Selecione uma imagem" }),
  //   user_id: z.string().uuid(),
  level_id: z.number(),
  visibility_type_id: z.number(),
  club_id: z.string().optional(),
  items: z.array(
    z.object({
      counting_mode: z.enum(["reps", "time"]),
      reps: z.number(),
      time: z.number(),
      queue: z.number(),
      comments: z.string().optional(),
      movement_id: z.number(),
    })
  ),
});

export default function FinishingTrainingModal({
  items,
  closeFinishinTrainingModal,
}: FinishingTrainingModalProps) {
  const [levels, setLevels] = useState<Level[]>([
    {
      value: 1,
      label: "Iniciante",
      description: "Para jogadores novatos",
    },
    {
      value: 2,
      label: "Intermediário",
      description: "Para jogadores com 2 ou mais anos de experiência",
    },
    {
      value: 3,
      label: "Avançado",
      description: "Para jogadores veteranos",
    },
  ]);
  const [visibilityTypes, setVisibilityTypes] = useState([
    {
      value: 1,
      label: "Público",
    },
    {
      value: 2,
      label: "Privado",
    },
  ]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      time: 0,
      icon_file: new File([], ""),
      //   user_id: "",
      level_id: undefined,
      visibility_type_id: undefined,
      club_id: "",
    },
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.setValue("items", items);
    form.handleSubmit(onSubmit)();
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
          `treinos/icone-representacao-${timestamp}.${file_extension}`
        );
      } else file = "";
    } else file = "";
    const { icon_file, ...rest } = data;
    const filteredData = { ...rest, icon_url: file };
    console.log(filteredData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-background/60">
      <div className="bg-secondary">
        Modal para finalização do treino
        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            <InputDefault
              control={form.control}
              name="title"
              placeholder="Título do treino"
              label="Título"
            />
            <InputDefault
              control={form.control}
              name="time"
              placeholder="Duração"
              label="Tempo do treino"
              type="number"
            />
            <InputImage name="icon_file" />
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
            <Button type="submit">Enviar</Button>
            <Button type="button" onClick={closeFinishinTrainingModal}>
              Voltar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
