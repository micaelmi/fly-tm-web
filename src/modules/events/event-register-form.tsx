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
import { useCreateEvent } from "@/hooks/use-events";
import { handleFileUpload } from "@/lib/firebase-upload";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/auth";
import { useSession } from "next-auth/react";

const resetTime = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const FormSchema = z
  .object({
    name: z.string().min(4, { message: "Mínimo de 4 caracteres" }),
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
    address_number: z
      .string()
      .regex(/^\d+$/, {
        message: "O campo deve conter apenas números",
      })
      .max(6, { message: "Máximo de 6 dígitos" }),
    complement: z.string(),
    level: z.number(),
    price: z.string(),
    representationUrl: z.instanceof(File).optional(),
    representationColor: z.string().optional(),
    representationOption: z.enum(["image", "color"]),
  })
  .superRefine((data, ctx) => {
    if (data.endsAt < data.startsAt) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"], // Path para o campo específico que será marcado com erro
        message: "A data de fim deve ser maior ou igual à data de início",
      });
    }

    if (data.representationOption === "image") {
      if (!data.representationUrl || data.representationUrl.size === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["representationUrl"],
          message: "Selecione uma imagem",
        });
      }
    } else if (data.representationOption === "color") {
      if (!data.representationColor || data.representationColor === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["representationColor"],
          message: "Selecione uma cor",
        });
      }
    }
  });

export default function EventRegisterForm() {
  const [payOption, setPayOption] = useState("no-value");
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
      address_number: "",
      complement: "",
      level: undefined,
      price: "",
      representationUrl: new File([], ""),
      representationColor: "ffff",
      representationOption: "image",
    },
  });

  useEffect(() => {
    if (currentDate) {
      form.reset({
        startsAt: currentDate,
        representationOption: "image",
        representationColor: "ffff",
      });
    }
  }, [currentDate, form]);

  const router = useRouter();

  const userId = useSession().data?.payload.sub;

  const { mutate, isPending, isError } = useCreateEvent();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let filteredData;
    if (data.representationUrl && data.representationUrl.size > 0) {
      let file;
      if (data.representationUrl instanceof File) {
        const timestamp = new Date().toISOString();
        const fileExtension = data.representationUrl.name.split(".").pop();
        file = await handleFileUpload(
          data.representationUrl,
          `eventos/imagem-representacao-${timestamp}.${fileExtension}`
        );
      } else file = "";

      const {
        representationUrl,
        representationColor,
        representationOption,
        ...rest
      } = data;
      filteredData = {
        ...rest,
        representation: file, // A URL da imagem após o upload
      };
    } else {
      // Atribuir a 'filteredData' o objeto 'data' removendo 'representationUrl'
      const {
        representationUrl,
        representationOption,
        representationColor,
        ...rest
      } = data;
      filteredData = { ...rest, representation: representationColor };
    }

    mutate(
      {
        name: filteredData.name,
        date: new Date().toISOString(),
        show_date: filteredData.startsAt.toISOString(),
        hide_date: filteredData.endsAt.toISOString(),
        cep: filteredData.cep,
        state: filteredData.state,
        city: filteredData.city,
        neighborhood: filteredData.neighborhood,
        street: filteredData.street,
        address_number: Number(filteredData.address_number),
        complement: filteredData.complement,
        maps_url: "sem link",
        description: "",
        image_url: filteredData.representation,
        price: filteredData.price,
        status: "active",
        level_id: filteredData.level,
        user_id: userId,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
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
                name="address_number"
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
              { value: 1, label: "Iniciante" },
              { value: 2, label: "Intermediário" },
              { value: 3, label: "Avançado" },
            ]}
            label="Qual o nível do evento?"
            searchLabel="Buscar nível..."
            selectLabel="Nível"
            className=""
            onSelect={(value: number) => {
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
                onValueChange={(value) => {
                  setPayOption(value);
                  if (value === "no-value") {
                    form.setValue("price", "");
                  }
                }}
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
                optionValue={form.watch("representationOption")}
                onValueChange={(value) => {
                  if (value === "image" || value === "color") {
                    form.setValue("representationOption", value);
                  }
                  if (value === "image") {
                    form.setValue("representationColor", "");
                  } else {
                    form.setValue("representationUrl", new File([], ""));
                  }
                }}
              />
              <div className="md:flex-1">
                {form.watch("representationOption") === "image" ? (
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
            <Button type="submit">
              {isPending ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  "Cadastrando"
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </div>
          {isError && (
            <div className="p-2 border border-destructive rounded-md w-full text-center text-destructive text-sm">
              Erro ao criar evento
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
