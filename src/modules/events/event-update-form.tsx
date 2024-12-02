"use client";
import Loading from "@/app/loading";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { useLevelsData } from "@/hooks/use-auxiliaries";
import { useCep } from "@/hooks/use-cep";
import { useGetEvent, useUpdateEvent } from "@/hooks/use-events";
import { Event } from "@/interfaces/event";
import { ComboboxItem, ComboboxOption } from "@/interfaces/level";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDots } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce";
import * as z from "zod";

const FormSchema = z
  .object({
    name: z.string().min(4, { message: "Mínimo de 4 caracteres" }),
    description: z.string().max(500, { message: "Máximo de 500 caracteres" }),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    cep: z.string().length(8, { message: "Deve conter 8 dígitos" }),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    address_number: z.coerce
      .string()
      .regex(/^\d+$/, {
        message: "O campo deve conter apenas números",
      })
      .max(6, { message: "Máximo de 6 dígitos" }),
    complement: z.string(),
    level: z.number(),
    price: z.string(),
    maps_url: z
      .string()
      .optional() // O campo é opcional
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: "A URL informada não é válida",
      }),
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
  });

export default function EventUpdateForm() {
  const eventId = useParams().id;
  const { data: eventData, isLoading, error } = useGetEvent(eventId as string);

  const [keepCurrentImage, setKeepCurrentImage] = useState<boolean>(false);
  const [payOption, setPayOption] = useState("no-value");
  const [representationFile, setRepresentationFile] = useState(
    new File([], "")
  );
  const [representationColor, setRepresentationColor] = useState("#ffffff");
  const [representationOption, setRepresentationOption] = useState("image");
  const [imageOrColorError, setImageOrColorError] = useState("");

  const getLocation = useDebouncedCallback(() => {
    if (isSuccess) {
      form.setValue("state", data.state);
      form.setValue("city", data.city);
      form.setValue("neighborhood", data.neighborhood);
      form.setValue("street", data.street);
      form.setValue("complement", data.complement);
    } else {
      form.setValue("state", "");
      form.setValue("city", "");
      form.setValue("neighborhood", "");
      form.setValue("street", "");
      form.setValue("complement", "");
    }
  }, 500);

  const levelsData = useLevelsData().data?.levels ?? [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      startsAt: undefined,
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
      maps_url: "",
      status: "active",
    },
  });

  const informedCep = form.watch("cep");

  const { data, isSuccess } = useCep(informedCep);

  const router = useRouter();

  const { mutate, isPending, isError } = useUpdateEvent();

  useEffect(() => {
    if (eventData?.event) {
      const event = eventData.event;
      const hasImageAsRepresentation =
        event.image_url && event.image_url.startsWith("http");

      const hasColorAsRepresentation =
        event.image_url && event.image_url.startsWith("#");

      setRepresentationColor(
        hasColorAsRepresentation ? event.image_url! : "#ffffff"
      );
      setRepresentationOption(hasColorAsRepresentation ? "color" : "image");

      form.reset({
        ...event,
        address_number: String(event.address_number),
        level: event.level_id,
        startsAt: new Date(event.start_date),
        endsAt: new Date(event.end_date),
        maps_url: event.maps_url ?? "",
      });

      setKeepCurrentImage(hasImageAsRepresentation ? true : false);
      setPayOption(event.price ? "with-value" : "no-value");
    }
  }, [eventData?.event]);

  if (isLoading || !eventData) return <Loading />;
  if (error) return <p>Erro ao carregar dados do evento: {error.message}</p>;

  const event = eventData?.event;

  const levels: ComboboxItem[] = levelsData.map((level: ComboboxOption) => ({
    value: level.id,
    label: level.title,
  }));

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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!keepCurrentImage) {
      if (representationOption === "image") {
        if (!representationFile || representationFile.size === 0) {
          setImageOrColorError("Selecione uma imagem");
          return;
        }
      } else if (representationOption === "color") {
        if (!representationColor || representationColor === undefined) {
          setImageOrColorError("Selecione uma cor");
          return;
        }
      }
      if (representationColor && representationColor.length < 6) {
        setImageOrColorError("Mínimo de 6 dígitos para o código da cor.");
        return;
      }
    }

    let filteredData;

    //Se a representação atual for uma image
    //e ele vai trocar por outra ou uma cor
    if (
      !keepCurrentImage &&
      event.image_url &&
      !event.image_url.startsWith("#")
    ) {
      deleteFile(event.image_url);
    }

    //Se está trocando a imagem atual por outra imagem
    if (
      !keepCurrentImage &&
      representationFile &&
      representationFile.size > 0
    ) {
      let file;
      if (representationFile instanceof File) {
        const timestamp = new Date().toISOString();
        const fileExtension = representationFile.name.split(".").pop();
        file = await handleFileUpload(
          representationFile,
          `eventos/imagem-representacao-${timestamp}.${fileExtension}`
        );
      } else file = "";

      filteredData = {
        ...data,
        representation: file, // A URL da imagem após o upload
      };
    } else {
      if (keepCurrentImage && !event.image_url?.startsWith("#")) {
        filteredData = { ...data, representation: event.image_url };
      } else {
        filteredData = { ...data, representation: representationColor };
      }
    }

    const isUrlValid =
      data.maps_url && z.string().url().safeParse(data.maps_url).success;

    console.log({
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
        maps_url: isUrlValid ? data.maps_url : "",
        image_url: filteredData.representation,
        price: filteredData.price,
        status: filteredData.status,
        level_id: filteredData.level,
      },
    });

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
          maps_url: isUrlValid ? data.maps_url : "",
          image_url: filteredData.representation,
          price: filteredData.price,
          status: filteredData.status,
          level_id: filteredData.level,
        },
      },
      {
        onSuccess: () => {
          router.push("/home");
        },
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 my-8 px-4 lg:px-12 max-w-screen-sm container">
        <div className="flex justify-center items-center gap-3 font-bold text-xl md:text-3xl">
          <CalendarDots />
          <h1 className="">Edite seu evento</h1>
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
                  onChange={getLocation}
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
              {event.image_url && !event.image_url.startsWith("#") ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={event.image_url}
                    width={80}
                    height={0}
                    className="border-primary border rounded-lg aspect-square"
                    alt="Imagem atual do perfil"
                    priority
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm leading-4 tracking-tight">
                      Essa é a representação atual. Desmarque a opção{" "}
                      <span className="text-primary">
                        "Manter imagem atual"
                      </span>{" "}
                      para alterá-la.
                    </p>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="check"
                        checked={keepCurrentImage}
                        onClick={() => {
                          setRepresentationFile(
                            new File(["Imagem mantida"], "Imagem mantida")
                          );
                          setKeepCurrentImage(!keepCurrentImage);
                        }}
                      />
                      <label
                        htmlFor="check"
                        className="peer-disabled:opacity-70 font-medium text-sm leading-none cursor-pointer peer-disabled:cursor-not-allowed"
                      >
                        Manter imagem atual
                      </label>
                    </div>
                  </div>
                </div>
              ) : null}
              {event.image_url &&
              (event.image_url.startsWith("#") ||
                keepCurrentImage === false) ? (
                <div className="flex md:flex-row flex-col gap-2">
                  <RadioButton
                    firstLabel="Imagem"
                    secondLabel="Cor"
                    firstValue="image"
                    secondValue="color"
                    optionValue={representationOption}
                    onValueChange={(value) => {
                      if (value === "image" || value === "color") {
                        setRepresentationOption(value);
                      }
                      if (value === "image") {
                        setRepresentationColor("");
                      } else {
                        setRepresentationFile(new File([], ""));
                      }
                    }}
                  />
                  <div className="md:flex-1">
                    {representationOption === "image" ? (
                      <InputImage
                        name="representationFile"
                        valueControlBy="state"
                        setRepresentationFile={setRepresentationFile}
                      />
                    ) : (
                      <ColorPicker
                        name="representationColor"
                        valueControlBy="state"
                        setRepresentationColor={setRepresentationColor}
                        defaultValue={
                          event.image_url && event.image_url.startsWith("#")
                            ? event.image_url
                            : "#ffffff"
                        }
                      />
                    )}
                  </div>
                </div>
              ) : null}
              {imageOrColorError ? (
                <p className="text-destructive text-sm">{imageOrColorError}</p>
              ) : null}
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
