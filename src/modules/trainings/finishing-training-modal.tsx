import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import InputDefault from "../../components/form/input-default";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputImage from "../../components/form/input-image";
import { handleFileUpload } from "@/lib/firebase-upload";
import DefaultCombobox from "../../components/form/combobox-default";
import { useEffect, useState } from "react";
import { Item } from "@/modules/trainings/training-register-form";
import { useCreateTraining } from "@/hooks/use-trainings";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";

interface FinishingTrainingModalProps {
  items: Item[];
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
  time: z.coerce.number(),
  icon_file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Selecione uma imagem" }),
  level_id: z.number(),
  visibility_type_id: z.number(),
});

export default function FinishingTrainingModal({
  items,
  description,
  closeFinishinTrainingModal,
}: FinishingTrainingModalProps) {
  const { data: session } = useSession();
  const user_id = session?.payload.sub;

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
      level_id: undefined,
      visibility_type_id: undefined,
    },
  });

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

    mutate(
      {
        title: filteredData.title,
        description: description,
        time: filteredData.time,
        icon_url: filteredData.icon_url,
        user_id: user_id,
        level_id: filteredData.level_id,
        visibility_type_id: filteredData.visibility_type_id,
        club_id: undefined,
        items: items,
      },
      {
        onSuccess: () => {
          router.push("/home");
        },
      }
    );
  };

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-background/60">
      <div className="bg-secondary">
        Modal para finalização do treino
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

            {isError ? (
              <p className="border-destructive border text-destructive">
                {error.message}
              </p>
            ) : null}

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
            <Button type="button" onClick={closeFinishinTrainingModal}>
              Voltar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
