"use client";
import ColorPicker from "@/components/form/color-picker";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import TextareaDefault from "@/components/form/textarea-default";
import Navbar from "@/components/navbar";
import RadioButton from "@/components/radio-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateClub } from "@/hooks/use-clubs";
import { useManageCredits } from "@/hooks/use-credits";
import { Location } from "@/interfaces/location";
import { UserData } from "@/interfaces/user";
import api from "@/lib/axios";
import { handleFileUpload } from "@/lib/firebase-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import * as z from "zod";
import ClubStepIndicator from "./club-step-indicator";
import { PlanCards } from "./plan-cards";

const FormSchema = z.object({
  name: z.string().min(4, { message: "Mínimo de 4 caracteres" }),
  description: z.string(),
  logo_url: z.instanceof(File).optional().nullable(),
  background: z.enum(["image", "color"]),
  background_url: z.instanceof(File).optional().nullable(),
  background_color: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  other_contacts: z.string().optional(),
  schedule: z.string(),
  prices: z.string(),
  cep: z.string().length(8, { message: "Deve conter 8 dígitos" }),
  state: z.string().length(2, { message: "Deve conter 2 dígitos" }),
  city: z.string().min(1, { message: "Preencha este campo" }),
  neighborhood: z.string().min(1, { message: "Preencha este campo" }),
  street: z.string().min(1, { message: "Preencha este campo" }),
  address_number: z.string().optional(),
  complement: z.string().optional(),
  maps_url: z.string().optional(),
  selected_plan: z.coerce.number(),
});
export default function ClubRegisterForm() {
  const { data: session } = useSession();

  const userId = session?.payload.sub || "";
  const username = session?.payload.username || "";
  const token = session?.token.user.token;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      logo_url: new File([], ""),
      background: "color",
      background_url: new File([], ""),
      background_color: "fff",
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
      address_number: "",
      complement: "",
      maps_url: "",
      selected_plan: 1,
    },
  });

  const plans = [
    { id: 1, price: 0, members: 5 },
    { id: 2, price: 250, members: 35 },
    { id: 3, price: 600, members: 150 },
  ];

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { mutate: createClub, isError } = useCreateClub();
  const { mutate: manageCredits } = useManageCredits();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    let successes = 0;
    if (!session) return;
    // passo 1 - verificar se o plano escolhido é pago
    const price =
      plans.find((plan) => plan.id === data.selected_plan)?.price || 0;
    const planMembers =
      plans.find((plan) => plan.id === data.selected_plan)?.members || 1;
    if (price > 0) {
      // passo 2 - verificar se o usuario possui saldo
      try {
        const user = await api.get<UserData>(`/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (user.data.user.credits && user.data.user.credits < price) {
          toast.error(
            "Você não possui créditos suficientes para escolher este plano."
          );
          return;
        }
        successes++;
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    } else {
      successes++;
    }

    // passo 3 - fazer upload das imagens
    if (successes == 0) return;
    // logo
    let logoFile: string;
    if (data.logo_url && data.logo_url.size > 0) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.logo_url.name.split(".").pop();
      logoFile =
        (await handleFileUpload(
          data.logo_url,
          `clubs/logo-${timestamp}.${fileExtension}`
        )) || "";
    } else logoFile = "";
    if (logoFile === undefined) logoFile = "";
    // background
    let background;
    if (
      data.background === "image" &&
      data.background_url &&
      data.background_url.size > 0
    ) {
      const timestamp = new Date().toISOString();
      const fileExtension = data.background_url.name.split(".").pop();
      background = await handleFileUpload(
        data.background_url,
        `clubs/background-${timestamp}.${fileExtension}`
      );
    }
    if (background === undefined) background = data.background_color || "#fff";

    // passo 4 - criar clube
    createClub(
      {
        name: data.name,
        description: data.description,
        logo_url: logoFile,
        background: background,
        owner_username: username,
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
        address_number: Number(data.address_number),
        complement: data.complement,
        maps_url: data.maps_url,
        max_members: planMembers,
      },
      {
        onSuccess: async (club) => {
          // passo 5 - subtrair créditos do usuário e registrar transação (efetuar pagamento)
          if (price > 0) {
            manageCredits({
              action: "spend",
              amount: price,
              description: `Criação do clube ${data.name}`,
              user_id: userId,
            });
          }
          // passo 6 - redirecionar para a pagina do clube criado
          router.push(`/clubs/${club.clubId}`);
        },
      }
    );
    setLoading(false);
  };

  function goBack() {
    router.back();
  }

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

  const [formStep, setFormStep] = useState(1);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-5 my-8 px-4 lg:px-12 max-w-screen-sm container">
        <div className="flex flex-col justify-center items-center font-bold">
          <h1 className="font-black text-3xl">Crie seu clube!</h1>
          <p className="text-center text-gray-400">
            E inicie uma nova jornada como gerente de uma comunidade.
          </p>
        </div>
        <ClubStepIndicator step={formStep} />
        <Form {...form}>
          <form
            className="flex flex-col gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div
              className={`flex flex-col gap-5 ${formStep !== 1 && "hidden"}`}
            >
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-sm">Logo</p>
                <InputImageWithPreview
                  name="logo_url"
                  selectedImageParentClassname="w-16 h-16"
                />
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
                      <InputImage name="background_url" />
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
                placeholder="Informe os valores dos serviços oferecidos (mensalidade, diária, por hora...)"
                name="prices"
              />
              <div className="flex justify-center md:justify-between gap-2 mt-4 mb-12">
                <Button type="button" variant={"outline"} onClick={goBack}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="flex-1"
                >
                  Continuar
                </Button>
              </div>
            </div>

            <div
              className={`flex flex-col gap-5 ${formStep !== 2 && "hidden"}`}
            >
              <div className="flex flex-col gap-2">
                <p className="peer-disabled:opacity-70 mt-4 font-medium text-sm leading-none peer-disabled:cursor-not-allowed">
                  Qual é o seu endereço?
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
              <div className="flex justify-center md:justify-between gap-2 mb-12">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setFormStep(1)}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  type="button"
                  onClick={() => setFormStep(3)}
                  className="flex-1"
                >
                  Continuar
                </Button>
              </div>
            </div>

            <div
              className={`flex flex-col gap-5 ${formStep !== 3 && "hidden"}`}
            >
              <PlanCards
                control={form.control}
                name="selected_plan"
                label="Selecione um plano"
              />
              {/* buttons: cancel and register */}
              <div className="flex justify-center md:justify-between gap-2 mb-20">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setFormStep(2)}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-400 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </Button>
              </div>
            </div>

            {isError && (
              <div className="border-destructive p-2 border rounded-md w-full text-center text-destructive text-sm">
                Erro ao criar clube, verifique se todos os campos foram
                preenchidos
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
