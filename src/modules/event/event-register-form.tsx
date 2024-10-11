"use client";

import DefaultCombobox from "@/components/form/combobox-default";
import DatePicker from "@/components/form/date-picker";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDots } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ColorPicker from "@/components/form/color-picker";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosResponse } from "axios";
import { City, Location, State } from "@/interfaces/location";
import { FaSpinner } from "react-icons/fa";
import RadioButton from "@/components/radio-button";
import { RealInput } from "@/components/form/real-input";

const resetTime = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const FormSchema = z
  .object({
    name: z.string(),
    startsAt: z.coerce
      .date()
      .refine((startsAt) => resetTime(startsAt) >= resetTime(new Date()), {
        message: "A data de início deve ser maior ou igual à data atual",
      }),
    endsAt: z.coerce.date(),
    cep: z.string().length(8, { message: "Deve conter 8 dígitos" }),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    number: z.string().regex(/^[A-Za-z0-9]+$/, {
      message: "O campo deve conter apenas letras e números",
    }),
    complement: z.string(),
    level: z.string(),
    //price: z.string(),
    representationUrl: z
      .instanceof(File)
      .refine((File) => File.size > 0, { message: "Selecione uma imagem" }),
    representationColor: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.endsAt < data.startsAt) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"], // Path para o campo específico que será marcado com erro
        message: "A data de fim deve ser maior ou igual à data de início.",
      });
    }
  });

export default function EventRegisterForm() {
  const [payOption, setPayOption] = useState("no-value");
  const [decorationOption, setDecorationOption] = useState("image");
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      startsAt: currentDate || undefined,
      endsAt: undefined,
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: "",
      level: "",
      //price: undefined,
      representationUrl: new File([], ""),
      representationColor: "",
    },
  });

  useEffect(() => {
    if (currentDate) {
      form.reset({
        startsAt: currentDate,
      });
    }
  }, [currentDate, form]);

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  const informedCep = form.watch("cep");

  const location = useQuery({
    queryKey: ["location", informedCep],
    queryFn: async (): Promise<AxiosResponse<Location>> => {
      return await api.get(`https://viacep.com.br/ws/${informedCep}/json/`);
    },

    enabled: /^\d{8}$/.test(informedCep),
    select: (data) => {
      return {
        state: data.data.uf,
        city: data.data.localidade,
        neighborhood: data.data.bairro,
        street: data.data.logradouro,
        complement: data.data.complemento,
      };
    },
  });

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Zera as horas, minutos e segundos
    setCurrentDate(now);
  }, []);

  useEffect(() => {
    if (location.isSuccess) {
      form.setValue("state", location.data.state);
      form.setValue("city", location.data.city);
      form.setValue("neighborhood", location.data.neighborhood);
      form.setValue("street", location.data.street);
      form.setValue("complement", location.data.complement);
    } else {
      form.setValue("state", "");
      form.setValue("city", "");
      form.setValue("neighborhood", "");
      form.setValue("street", "");
      form.setValue("complement", "");
    }
  }, [location.isSuccess, location.data]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 items-center justify-center text-xl md:text-3xl font-bold">
        <CalendarDots />
        <h1 className="">Cadastre seu evento</h1>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* name */}
          <InputDefault
            control={form.control}
            label="Qual o nome do evento?"
            placeholder="Informe o nome ou título que identifica seu evento"
            name="name"
          />
          {/* when */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Quando?
            </p>
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div className="sm:hidden md:flex md:flex-col md:gap-2">
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Inicio:
                  </p>
                  <div className="sm:hidden md:block md:h-1 md:rounded md:bg-event-green" />
                </div>
                <DatePicker control={form.control} name="startsAt" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div className="sm:hidden md:flex md:flex-col md:gap-2">
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Fim:
                  </p>
                  <div className="sm:hidden md:block md:h-1 md:rounded md:bg-event-red" />
                </div>
                <DatePicker control={form.control} name="endsAt" />
              </div>
            </div>
          </div>
          {/* where */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Onde o evento acontecerá?
            </p>
            <div className="flex flex-col gap-2 md:flex-row">
              <InputDefault
                control={form.control}
                name="cep"
                placeholder="CEP"
                className="md:flex-1"
                maxLength={8}
              />

              <InputDefault
                control={form.control}
                name="state"
                placeholder="UF"
                readOnly={true}
                className="md:w-1/6"
              />
            </div>
            <InputDefault
              control={form.control}
              name="city"
              placeholder="Cidade"
              readOnly={true}
            />
            <InputDefault
              control={form.control}
              name="neighborhood"
              placeholder="Bairro"
            />
            <InputDefault
              control={form.control}
              name="street"
              placeholder="Rua"
            />
            <div className="flex flex-col gap-2 md:flex-row">
              <InputDefault
                control={form.control}
                name="number"
                placeholder="Nº"
                className="md:w-1/6"
              />
              <InputDefault
                control={form.control}
                name="complement"
                placeholder="Complemento"
                className="md:flex-1"
              />
            </div>
          </div>
          {/* target audience */}
          <DefaultCombobox
            control={form.control}
            name="level"
            object={[
              { value: "Iniciante", label: "Iniciante" },
              { value: "Intermediário", label: "Intermediário" },
              { value: "Avançado", label: "Avançado" },
            ]}
            label="Qual o nível do evento?"
            searchLabel="Buscar nível..."
            selectLabel="Nível"
            className=""
            onSelect={(value: string) => {
              form.setValue("level", value);
            }}
          />
          {/* payment */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              É cobrado algum valor de entrada/participação?
            </p>
            <div className="flex flex-col gap-2 md:flex-row">
              <RadioButton
                firstLabel="Não"
                secondLabel="Sim"
                firstValue="no-value"
                secondValue="with-value"
                optionValue={payOption}
                onValueChange={setPayOption}
              />
              <RealInput
                control={form.control}
                name="price"
                placeholder="Valor (R$)"
                disabled={payOption === "no-value"}
                className="md:flex-1"
              />
            </div>
          </div>
          {/* representation */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Escolha como representar seu evento!
            </p>
            <div className="flex flex-col gap-2 md:flex-row">
              <RadioButton
                firstLabel="Imagem"
                secondLabel="Cor"
                firstValue="image"
                secondValue="color"
                optionValue={decorationOption}
                onValueChange={setDecorationOption}
              />
              <div className="md:flex-1">
                {decorationOption === "image" ? (
                  <InputImage name="representationUrl" />
                ) : (
                  <ColorPicker name="representationColor" />
                )}
              </div>
            </div>
          </div>
          {/* buttons: cancel and register */}
          <div className="flex flex-col gap-2 md:flex-row md:justify-between">
            <Button type="button" variant={"outline"}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className=""
              onClick={() => {
                console.log(form.getValues("startsAt").getDate());
                console.log(form.getValues("endsAt").getDate());
                console.log(
                  form.getValues("endsAt").getDate() >=
                    form.getValues("startsAt").getDate()
                );
              }}
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
