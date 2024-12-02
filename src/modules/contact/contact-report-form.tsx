"use client";
import DefaultCombobox from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContactTypesData, useCreateContact } from "@/hooks/use-contacts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import * as z from "zod";

const FormSchema = z.object({
  title: z.string().min(4, { message: "Mínimo 4 letras." }),
  description: z.string().min(4, { message: "Mínimo 4 letras." }),
  contact_type_id: z.number(),
});

interface ContactReportFormProps {
  type: "treino" | "estratégia";
  id: string;
}

export default function ContactReportForm({
  type,
  id,
}: ContactReportFormProps) {
  const userId = useSession().data?.payload.sub;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: `Denúncia ${type === "estratégia" ? "da estratégia" : "do treino"} com ID: ${id}`,
      description: "",
      contact_type_id: 2,
    },
  });

  interface item {
    value: number;
    label: string;
  }
  const [contactTypes, setContactTypes] = useState<item[]>([]);
  const { data: contactTypesData } = useContactTypesData();
  useEffect(() => {
    if (contactTypesData?.contactTypes) {
      // Mapeia os dados para o formato esperado de `contactTypes`
      const mappedContactTypes = contactTypesData.contactTypes.map(
        (contactType) => ({
          value: contactType.id,
          label: contactType.description,
        })
      );

      // Atualiza o estado de uma só vez
      setContactTypes(mappedContactTypes);
    }
  }, [contactTypesData]);

  const router = useRouter();

  const { mutate, isError, error, isPending } = useCreateContact();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!userId) return console.error("Invalid session");
    mutate(
      {
        title: data.title,
        description: data.description,
        contact_type_id: data.contact_type_id,
        user_id: userId,
      },
      {
        onSuccess: () => {
          toast.success("Sua mensagem foi enviada!");
          setTimeout(() => {
            router.push(`/users/my-contacts/${userId}`);
          }, 3000);
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Denunciar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Denunciar {type}</DialogTitle>
          <DialogDescription>
            Envie sua denúncia para os administradores da plataforma.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-3 w-full"
          >
            <DefaultCombobox
              control={form.control}
              name="contact_type_id"
              object={contactTypes}
              label="Qual motivo do seu contato?"
              searchLabel="Buscar tipo..."
              selectLabel="Tipo de contato"
              onSelect={(value: number) => {
                form.setValue("contact_type_id", value);
              }}
              disabled
            />
            <InputDefault
              control={form.control}
              label="Título"
              placeholder="Sobre o que se trata este contato"
              name="title"
              readOnly
            />
            <TextareaDefault
              control={form.control}
              label="Mensagem"
              placeholder="Descreva o motivo da sua denúncia"
              name="description"
              className="resize-none"
            />

            <DialogFooter>
              <Button type="submit" className="self-end" disabled={isPending}>
                {isPending ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar"
                )}
              </Button>
            </DialogFooter>

            {isError && (
              <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
                {error.message}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
