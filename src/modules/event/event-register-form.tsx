"use client";

import DatePicker from "@/components/form/datePicker";
import InputDefault from "@/components/form/input-default";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDots } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  name: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  location: z.object({
    cep: z.string().length(8),
    uf: z.string().length(2),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    number: z.number(),
    complement: z.string(),
  }),
  targetPublic: z.enum(["Iniciante", "Intermediário", "Avançado"]),
  price: z.number(),
  representation: z.union([z.instanceof(File), z.string()]),
});

export default function EventRegisterForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      startsAt: new Date(),
      endsAt: undefined,
      location: {
        cep: "",
        uf: "",
        city: "",
        neighborhood: "",
        street: "",
        number: undefined,
        complement: "",
      },
      targetPublic: undefined,
      price: undefined,
      representation: undefined,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {};

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-8">
        <CalendarDots size={35} />
        <h1 className="font-bold text-3xl">Cadastre seu evento</h1>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col flex-1 gap-4 mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* name */}
          <InputDefault
            control={form.control}
            label="Qual o nome do evento?"
            placeholder="Informe o nome ou título que identifica seu evento"
            name="name"
            type="text"
          />
          {/* when */}
          <div>
            <p className="text-sm">Quando?</p>
            <div className="flex gap-9">
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center items-center gap-1 w-min font-light text-sm">
                  Inicio:
                  <div className="bg-green-500 rounded w-full h-1"></div>
                </div>
                <DatePicker control={form.control} name="startsAt" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center items-center gap-1 w-min font-light text-sm">
                  Fim:
                  <div className="bg-red-500 rounded w-full h-1"></div>
                </div>
                <DatePicker control={form.control} name="endsAt" />
              </div>
            </div>
          </div>
          {/* where */}
          <div>
            <p className="text-sm">Onde o evento acontecerá?</p>
            <div>
              <div className="flex">
                <InputDefault
                  control={form.control}
                  name="cep"
                  placeholder="CEP"
                  type="text"
                />
                <InputDefault
                  control={form.control}
                  name="uf"
                  placeholder="UF"
                  type="text"
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
