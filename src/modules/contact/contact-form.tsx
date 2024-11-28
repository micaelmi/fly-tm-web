"use client";
import DefaultCombobox from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
export default function ContactForm() {
  const userId = useSession().data?.payload.sub;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      contact_type_id: 0,
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
            router.push("/home");
          }, 3000);
        },
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 my-8 px-4 lg:px-12 max-w-screen-sm container">
        <div className="flex justify-center items-center gap-3 font-bold text-xl md:text-3xl">
          <h1>Entre em contato conosco</h1>
        </div>
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
            />
            <InputDefault
              control={form.control}
              label="Título"
              placeholder="Sobre o que se trata este contato"
              name="title"
            />
            <TextareaDefault
              control={form.control}
              label="Mensagem"
              placeholder="Deixe aqui sua mensagem"
              name="description"
            />
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
            {isError && (
              <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
                {error.message}
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
