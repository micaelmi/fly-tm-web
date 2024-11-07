"use client";
import ColorPicker from "@/components/form/color-picker";
import DefaultCombobox from "@/components/form/combobox-default";
import DatePicker from "@/components/form/date-picker";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import { RealInput } from "@/components/form/real-input";
import TextareaDefault from "@/components/form/textarea-default";
import Navbar from "@/components/navbar";
import RadioButton from "@/components/radio-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateClub } from "@/hooks/use-clubs";
import { useCreateEvent } from "@/hooks/use-events";
import { Location } from "@/interfaces/location";
import api from "@/lib/axios";
import { handleFileUpload } from "@/lib/firebase-upload";
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

const FormSchema = z.object({
  name: z.string().min(4, { message: "Mínimo de 4 caracteres" }),
  description: z.string(),
  logo_url: z.instanceof(File).optional(),
  background: z.enum(["image", "color"]),
  background_url: z.instanceof(File).optional(),
  background_color: z.string().optional(),
  owner_username: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  other_contacts: z.string().optional(),
  schedule: z.string(),
  prices: z.string(),
  cep: z.string().length(8, { message: "Deve conter 8 dígitos" }),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  address_number: z.number().optional(),
  complement: z.string().optional(),
  maps_url: z.string().optional(),
  max_members: z.number(),
});
export default function ClubRegisterForm() {
  const { data: session } = useSession();
  if (!session) return;
  const user = session?.payload.username;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      logo_url: new File([], ""),
      background: "color",
      background_url: new File([], ""),
      background_color: "ffffff",
      owner_username: "",
      email: "",
      phone: "",
      instagram: "",
      other_contacts: "",
      schedule: "",
      prices: "",
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      address_number: 0,
      complement: "",
      maps_url: "",
      max_members: 5,
    },
  });

  const router = useRouter();
  const { mutate, isPending, isError } = useCreateClub();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let file;
    if (data.logo_url && data.logo_url.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.logo_url.name.split(".").pop();
      file = await handleFileUpload(
        data.logo_url,
        `clubs/logo-${timestamp}.${fileExtension}`
      );
    } else file = "";
    if (file === undefined) file = "";

    mutate(
      {
        name: data.name,
        description: data.description,
        logo_url: file,
        background: data.background,
        owner_username: user,
        email: data.email,
        phone: data.phone,
        instagram: data.instagram,
        other_contacts: data.other_contacts,
        schedule: data.schedule,
        prices: data.prices,
        cep: data.cep,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        address_number: data.address_number,
        complement: data.complement,
        maps_url: data.maps_url,
        max_members: data.max_members,
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
      <div className="flex flex-col gap-5my-8 px-4 lg:px-12 max-w-screen-sm container">
        <div className="flex flex-col justify-center items-center mt-12 font-bold">
          <h1 className="font-black text-3xl">Crie seu clube!</h1>
          <p className="text-gray-400">
            E inicie uma nova jornada como gerente de uma comunidade.
          </p>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-sm">Logo</p>
              <InputImageWithPreview control={form.control} name="logo_url" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                Defina uma capa para seu clube
              </p>
              <div className="flex md:flex-row flex-col gap-2">
                <RadioButton
                  firstLabel="Imagem"
                  secondLabel="Cor"
                  firstValue="image"
                  secondValue="color"
                  optionValue={form.watch("background")}
                  onValueChange={(value) => {
                    if (value === "image" || value === "color") {
                      form.setValue("background", value);
                    }
                    if (value === "image") {
                      form.setValue("background_color", "");
                    } else {
                      form.setValue("background_url", new File([], ""));
                    }
                  }}
                />
                <div className="md:flex-1">
                  {form.watch("background") === "image" ? (
                    <InputImage name="background_Url" />
                  ) : (
                    <ColorPicker name="background_color" />
                  )}
                </div>
              </div>
            </div>
            {/* name */}
            <InputDefault
              control={form.control}
              label="Nome do clube"
              placeholder="Digite o nome do seu clube"
              name="name"
            />
            <TextareaDefault
              control={form.control}
              label="Texto de apresentação"
              placeholder="Descreva seu clube em um pequeno texto"
              name="description"
            />
            <InputDefault
              control={form.control}
              type="email"
              label="E-mail de contato"
              placeholder="Digite o e-mail do seu clube"
              name="email"
            />
            <InputDefault
              control={form.control}
              label="Telefone"
              placeholder="Digite o telefone do seu clube"
              name="phone"
            />
            <InputDefault
              control={form.control}
              label="Instagram"
              placeholder="Digite o instagram do seu clube"
              name="instagram"
            />
            <TextareaDefault
              control={form.control}
              label="Outras formas de contato"
              placeholder="Insira outros contatos se houver"
              name="other_contacts"
            />
            <TextareaDefault
              control={form.control}
              label="Horários de funcionamento"
              placeholder="Informe os dias e horários de funcionamento do clube"
              name="schedule"
            />
            <TextareaDefault
              control={form.control}
              label="Valores"
              placeholder="Informe os valores dos serviços oferecidos 
(mensalidade, diária, por hora...)"
              name="prices"
            />

            {/* buttons: cancel and register */}
            <div className="flex md:flex-row flex-col md:justify-between gap-2 mb-12">
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
