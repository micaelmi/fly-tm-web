"use client";

import DefaultCombobox from "@/components/form/combobox-default";
import DatePicker from "@/components/form/date-picker";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDots } from "@phosphor-icons/react/dist/ssr";
import { formToJSON } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ColorPicker from "@/components/form/color-picker";
import { Button } from "@/components/ui/button";

const FormSchema = z
  .object({
    name: z.string(),
    startsAt: z.date().refine((startsAt) => startsAt >= new Date(), {
      message: "A data de início deve ser maior ou igual à data atual.",
    }),
    endsAt: z.date(),
    location: z.object({
      cep: z.string().length(8),
      uf: z.number(),
      city: z.number(),
      neighborhood: z.string(),
      street: z.string(),
      number: z.number(),
      complement: z.string(),
    }),
    targetPublic: z.enum(["Iniciante", "Intermediário", "Avançado"]),
    price: z.number(),
    representation: z.union([z.instanceof(File), z.string()]),
  })
  .refine((data) => data.endsAt >= data.startsAt);

export default function EventRegisterForm() {
  const [selectedPayOption, setSelectedPayOption] = useState("option-no");
  const [selectedDecorationOption, setSelectedDecorationOption] =
    useState("option-image");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      startsAt: new Date(),
      endsAt: undefined,
      location: {
        cep: "",
        uf: 0,
        city: 0,
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

  const ufs = [
    {
      label: "SP",
      value: "1",
    },
    {
      label: "RJ",
      value: "2",
    },
    {
      label: "GO",
      value: "3",
    },
  ];

  const cities = [
    {
      label: "São Paulo",
      value: "1",
    },
    {
      label: "Rio de Janeiro",
      value: "2",
    },
  ];

  const publicLevels = [
    {
      label: "Iniciante",
      value: "Iniciante",
    },
    {
      label: "Intermediário",
      value: "Intermediário",
    },
    {
      label: "Avançado",
      value: "Avançado",
    },
  ];

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
              <div className="flex gap-7">
                <InputDefault
                  control={form.control}
                  name="cep"
                  placeholder="CEP"
                  className="flex-1"
                />

                <DefaultCombobox
                  control={form.control}
                  name="uf"
                  object={ufs}
                  selectLabel="UF"
                  searchLabel="Buscar estado..."
                  onSelect={(value: number) => {
                    form.setValue("location.uf", value);
                  }}
                />
              </div>
              <DefaultCombobox
                control={form.control}
                name="city"
                object={cities}
                searchLabel="Buscar cidade..."
                selectLabel="Cidade"
                onSelect={(value: number) => {
                  console.log(value);
                  form.setValue("location.city", value);
                }}
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
              <div className="flex gap-7">
                <InputDefault
                  control={form.control}
                  name="number"
                  placeholder="Nº"
                  className="w-20"
                />

                <InputDefault
                  control={form.control}
                  name="complement"
                  placeholder="Complemento"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          {/* target audience */}
          <DefaultCombobox
            control={form.control}
            name="targetPublic"
            object={publicLevels}
            label="Qual o público-alvo do evento? (nível)"
            searchLabel="Buscar nível..."
            selectLabel="Nível"
            onSelect={(value: "Iniciante" | "Intermediário" | "Avançado") => {
              form.setValue("targetPublic", value);
            }}
          />
          {/* payment */}
          <div>
            <p className="font-medium text-sm">
              É cobrado algum valor de entrada/participação?
            </p>
            <div className="flex gap-8">
              <RadioGroup
                className="flex gap-5"
                value={selectedPayOption}
                onValueChange={setSelectedPayOption}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-no" id="option-no" />
                  <Label htmlFor="option-no">Não</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-yes" id="option-yes" />
                  <Label htmlFor="option-yes">Sim</Label>
                </div>
              </RadioGroup>
              <InputDefault
                control={form.control}
                name="price"
                placeholder="Valor (R$)"
                className="flex-1"
                disabled={selectedPayOption === "option-no"}
              />
            </div>
          </div>
          {/* representation */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              Escolha como representar seu evento!
            </p>
            <div className="flex gap-8">
              <RadioGroup
                className="flex gap-5"
                value={selectedDecorationOption}
                onValueChange={setSelectedDecorationOption}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-image" id="option-image" />
                  <Label htmlFor="option-image">Imagem</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-color" id="option-color" />
                  <Label htmlFor="option-color">Cor</Label>
                </div>
              </RadioGroup>
              <div className="relative flex flex-1">
                {selectedDecorationOption === "option-image" ? (
                  <InputImage control={form.control} name="representation" />
                ) : (
                  <ColorPicker control={form.control} name="representation" />
                )}
              </div>
            </div>
          </div>
          {/* buttons: cancel and register */}
          <div className="flex justify-between mt-5">
            <Button variant={"outline"}>Cancelar</Button>
            <Button type="submit" className="font-semibold">
              Cadastrar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
