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
import RealInput from "@/components/form/real-input";

const FormSchema = z
  .object({
    name: z.string(),
    startsAt: z.date().refine((startsAt) => startsAt >= new Date(), {
      message: "A data de início deve ser maior ou igual à data atual.",
    }),
    endsAt: z.date(),
    cep: z.string().length(8),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    number: z.string().regex(/^[A-Za-z0-9]+$/, {
      message: "O campo deve conter apenas letras e números.",
    }),
    complement: z.string(),
    level: z.string(),
    //price: z.string(),
    representationUrl: z.instanceof(File),
    representationColor: z.string(),
  })
  .refine((data) => data.endsAt >= data.startsAt, {
    message: "A data de fim deve ser maior ou igual à data de início.",
  });

export default function EventRegisterForm() {
  const [payOption, setPayOption] = useState("no-value");
  const [decorationOption, setDecorationOption] = useState("image");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      startsAt: new Date(),
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

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("OLA");
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
  //   queryKey: ["levels"],
  //   queryFn: async (): Promise<AxiosResponse<City[]>> => {
  //     return await api.get(
  //       `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${states.data?.find((state) => state.value == selectedState)?.id}/municipios`
  //     );
  //   },
  //   select: (data) => {
  //     return data.data.map((city) => {
  //       return {
  //         id: city.id,
  //         value: city.nome,
  //         label: city.nome,
  //       };
  //     });
  //   },
  // });

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
          <div className="flex flex-col gap-2">
            <p className="text-sm">Onde o evento acontecerá?</p>

            <div className="flex gap-7 items-center">
              <InputDefault
                control={form.control}
                name="cep"
                placeholder="CEP"
                className="flex-1"
                maxLength={8}
              />

              <InputDefault
                control={form.control}
                name="state"
                placeholder="UF"
                readOnly={true}
                className="w-20"
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
          {/* target audience */}
          <DefaultCombobox
            control={form.control}
            name="level"
            object={[
              { value: "Iniciante", label: "Iniciante" },
              { value: "Intermediário", label: "Intermediário" },
              { value: "Avançado", label: "Avançado" },
            ]}
            label="Qual o nível do evento? (nível)"
            searchLabel="Buscar nível..."
            selectLabel="Nível"
            className="w-full"
            onSelect={(value: string) => {
              form.setValue("level", value);
            }}
          />
          {/* payment
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              É cobrado algum valor de entrada/participação?
            </p>
            <div className="flex gap-8">
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
              />
            </div>
          </div> */}
          {/* representation */}
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              Escolha como representar seu evento!
            </p>
            <div className="flex gap-8">
              <RadioButton
                firstLabel="Imagem"
                secondLabel="Cor"
                firstValue="image"
                secondValue="color"
                optionValue={decorationOption}
                onValueChange={setDecorationOption}
              />
              <div className="relative flex flex-1">
                {decorationOption === "image" ? (
                  <InputImage control={form.control} name="representationUrl" />
                ) : (
                  <ColorPicker
                    control={form.control}
                    name="representationColor"
                  />
                )}
              </div>
            </div>
          </div>
          {/* buttons: cancel and register */}
          <div className="flex justify-between mt-5">
            <Button variant={"outline"}>Cancelar</Button>
            <Button
              type="button"
              onClick={() => console.log(form.getValues("representationUrl"))}
              className="font-semibold"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
