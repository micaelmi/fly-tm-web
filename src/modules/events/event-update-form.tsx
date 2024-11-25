"use client";
import { CancelButton } from "@/components/cancel-button";
import ColorPicker from "@/components/form/color-picker";
import DefaultCombobox from "@/components/form/combobox-default";
import DatePicker from "@/components/form/date-picker";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import InputRadio from "@/components/form/input-radio";
import { RealInput } from "@/components/form/real-input";
import TextareaDefault from "@/components/form/textarea-default";
import Navbar from "@/components/navbar";
import RadioButton from "@/components/radio-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLevelsData } from "@/hooks/use-auxiliaries";
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events";
import { Event } from "@/interfaces/event";
import { Level, LevelResponse } from "@/interfaces/level";
import { Location } from "@/interfaces/location";
import api from "@/lib/axios";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDots } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import * as z from "zod";

const FormSchema = z
  .object({
    name: z.string().min(4, { message: "Mínimo de 4 caracteres" }),
    description: z.string(),
    startsAt: z.coerce.date(),
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
    maps_url: z.string().optional(),
    status: z.enum(["active", "inactive"]),
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

export default function EventUpdateForm({
  eventData: event,
}: {
  eventData: Event;
}) {
  const { data: session } = useSession();
  const userId = session?.payload.sub;

  const [payOption, setPayOption] = useState(
    event.price ? "with-value" : "no-value"
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      startsAt: new Date(event.start_date) || undefined,
      endsAt: new Date(event.end_date) || undefined,
      cep: event.cep || "",
      state: event.state || "",
      city: event.city || "",
      neighborhood: event.neighborhood || "",
      street: event.street || "",
      address_number: event.address_number.toString(),
      complement: event.complement || "",
      level: event.level_id,
      price: event.price,
      representationUrl: new File([], ""),
      representationColor:
        event.image_url && event.image_url.startsWith("#")
          ? event.image_url
          : "fff",
      representationOption:
        event.image_url && event.image_url.startsWith("#") ? "color" : "image",
      maps_url: event.maps_url || "",
      status: event.status,
    },
  });

  const router = useRouter();

  const { mutate, isPending, isError } = useUpdateEvent();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let filteredData;
    if (data.representationUrl && data.representationUrl.size > 0) {
      let file;
      if (data.representationUrl instanceof File) {
        if (event.image_url) deleteFile(event.image_url);
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
        eventId: event.id,
        data: {
          name: filteredData.name,
          description: filteredData.description,
          start_date: filteredData.startsAt.toISOString(),
          end_date: filteredData.endsAt.toISOString(),
          cep: filteredData.cep,
          state: filteredData.state,
          city: filteredData.city,
          neighborhood: filteredData.neighborhood,
          street: filteredData.street,
          address_number: Number(filteredData.address_number),
          complement: filteredData.complement,
          maps_url:
            filteredData.maps_url && filteredData.maps_url?.length > 0
              ? filteredData.maps_url
              : undefined,
          image_url: filteredData.representation,
          price: filteredData.price,
          status: filteredData.status,
          level_id: filteredData.level,
        },
      },
      {
        onSuccess: () => {
          router.back();
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

  const token = session?.token.user.token;
  const [levelData, setLevelData] = useState<Level[]>([]);
  async function fetchLevels() {
    if (session) {
      const response = await api.get<LevelResponse>("/levels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLevelData(response.data.levels);
    }
  }

  interface item {
    value: number;
    label: string;
  }
  const levels: item[] = [];

  levelData.map((level) =>
    levels.push({ value: level.id, label: level.title })
  );

  useEffect(() => {
    fetchLevels();
  }, [session]);

  const status = [
    {
      value: "active",
      label: "Ativo",
    },
    {
      value: "inactive",
      label: "Inativo",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 my-8 px-4 lg:px-12 max-w-screen-sm container">
        <div className="flex justify-center items-center gap-3 font-bold text-xl md:text-3xl">
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
            <TextareaDefault
              control={form.control}
              label="Descreva seu evento"
              placeholder="Adicione uma descrição do seu evento, e formas de contato."
              name="description"
            />
            {/* when */}
            <div className="flex flex-col gap-2">
              <p className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                Quando?
              </p>
              <div className="flex md:flex-row flex-col flex-wrap md:justify-between gap-2">
                <div className="flex md:flex-row flex-col md:items-center gap-2">
                  <div className="md:flex md:flex-col md:gap-2 sm:hidden">
                    <p className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                      Inicio:
                    </p>
                    <div className="md:block sm:hidden md:bg-event-green md:rounded md:h-1" />
                  </div>
                  <DatePicker control={form.control} name="startsAt" />
                </div>
                <div className="flex md:flex-row flex-col md:items-center gap-2">
                  <div className="md:flex md:flex-col md:gap-2 sm:hidden">
                    <p className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                      Fim:
                    </p>
                    <div className="md:block sm:hidden md:bg-event-red md:rounded md:h-1" />
                  </div>
                  <DatePicker control={form.control} name="endsAt" />
                </div>
              </div>
            </div>
            {/* where */}
            <div className="flex flex-col gap-2">
              <p className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                Onde o evento acontecerá?
              </p>
              <div className="flex md:flex-row flex-col gap-2">
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
              <div className="flex md:flex-row flex-col gap-2">
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
            {/* maps */}
            <InputDefault
              control={form.control}
              label="Link do Google Maps (cole aqui)"
              placeholder="Ajude as pessoas a encontrarem o local"
              name="maps_url"
            />
            {/* target audience */}
            <DefaultCombobox
              control={form.control}
              name="level"
              object={levels}
              label="Qual o nível do evento?"
              searchLabel="Buscar nível..."
              selectLabel="Nível"
              className=""
              onSelect={(value: number) => {
                form.setValue("level", value);
              }}
            />
            <InputRadio
              control={form.control}
              name="status"
              label="Status"
              object={status}
              idExtractor={(item) => item.value}
              descriptionExtractor={(item) => item.label}
            />
            {/* payment */}
            <div className="flex flex-col gap-2">
              <p className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                É cobrado algum valor de entrada/participação?
              </p>
              <div className="flex md:flex-row flex-col gap-2">
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
              <p className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                Escolha como representar seu evento!
              </p>
              <div className="flex md:flex-row flex-col gap-2">
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
                    <ColorPicker
                      name="representationColor"
                      defaultValue={
                        event.image_url && event.image_url.startsWith("#")
                          ? event.image_url
                          : "fff"
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* buttons: cancel and register */}
            <div className="flex md:flex-row flex-col md:justify-between gap-2 mb-16">
              <CancelButton />
              <Button type="submit">
                {isPending ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Atualizando
                  </>
                ) : (
                  "Atualizar"
                )}
              </Button>
            </div>
            {isError && (
              <div className="border-destructive p-2 border rounded-md w-full text-center text-destructive text-sm">
                Erro ao criar evento
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
