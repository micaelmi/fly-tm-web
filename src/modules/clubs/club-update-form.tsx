"use client";
import { Club } from "@/interfaces/club";
import ColorPicker from "@/components/form/color-picker";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import TextareaDefault from "@/components/form/textarea-default";
import Navbar from "@/components/navbar";
import RadioButton from "@/components/radio-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUpdateClub } from "@/hooks/use-clubs";
import { useManageCredits } from "@/hooks/use-credits";
import { Location } from "@/interfaces/location";
import { UserData } from "@/interfaces/user";
import api from "@/lib/axios";
import { deleteFile, handleFileUpload } from "@/lib/firebase-upload";
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
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

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
  selected_plan: z.string(),
});
export default function ClubUpdateForm({ clubData: club }: { clubData: Club }) {
  const { data: session } = useSession();

  const userId = session?.payload.sub || "";
  const username = session?.payload.username || "";
  const token = session?.token.user.token;

  const plans = [
    { id: 1, price: 0, members: 5 },
    { id: 2, price: 250, members: 35 },
    { id: 3, price: 600, members: 150 },
  ];

  const selectedPlan = plans.find((plan) => plan.members === club.max_members);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: club.name,
      description: club.description,
      logo_url: new File([], ""),
      background: club.background.startsWith("#") ? "color" : "image",
      background_url: new File([], ""),
      background_color: club.background.startsWith("#")
        ? club.background
        : "fff",
      email: club.email,
      phone: club.phone,
      instagram: club.instagram,
      other_contacts: club.other_contacts,
      schedule: club.schedule,
      prices: club.prices,
      cep: club.cep,
      state: club.state,
      city: club.city,
      neighborhood: club.neighborhood,
      street: club.street,
      address_number: club.address_number?.toString(),
      complement: club.complement,
      maps_url: club.maps_url,
      selected_plan: (selectedPlan?.id || 1).toString(),
    },
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { mutate: updateClub, isError } = useUpdateClub();
  const { mutate: manageCredits } = useManageCredits();

  const [removeLogo, setRemoveLogo] = useState(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    let successes = 0;
    if (!session) return;
    // passo 1 - verificar se o plano escolhido é pago
    const price =
      plans.find((plan) => plan.id === Number(data.selected_plan))?.price || 0;
    const planMembers =
      plans.find((plan) => plan.id === Number(data.selected_plan))?.members ||
      1;
    if (price > 0 && planMembers !== club.max_members) {
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
    let logoFile = club.logo_url; // Por padrão, reutilizar a logo atual

    if (removeLogo) {
      logoFile = "";
      if (club.logo_url) deleteFile(club.logo_url);
    } else if (data.logo_url instanceof File && data.logo_url.size > 0) {
      logoFile =
        (await handleFileUpload(
          data.logo_url,
          `clubs/logo-${Date.now()}.${data.logo_url.name.split(".").pop()}`
        )) || "";
      if (club.logo_url) deleteFile(club.logo_url);
    }

    // background
    let background = data.background_color || "#fff"; // Cor padrão

    if (
      data.background === "image" &&
      data.background_url &&
      data.background_url?.size > 0
    ) {
      const uploadedBackground = await handleFileUpload(
        data.background_url,
        `clubs/background-${Date.now()}.${data.background_url.name.split(".").pop()}`
      );
      if (uploadedBackground) {
        background = uploadedBackground;
        if (club.background.startsWith("http")) deleteFile(club.background);
      } else {
        toast.error("Falha ao fazer upload da imagem de fundo.");
      }
    }

    // passo 4 - atualizar clube
    updateClub(
      {
        clubId: club.id,
        data: {
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
      },
      {
        onSuccess: async (club) => {
          // passo 5 - subtrair créditos do usuário e registrar transação (efetuar pagamento)
          if (
            price > 0 &&
            planMembers !== club.max_members &&
            selectedPlan &&
            selectedPlan?.price !== price
          ) {
            const newPrice = price - selectedPlan?.price;
            manageCredits({
              action: "spend",
              amount: newPrice,
              description: `Atualização de plano do clube ${data.name}`,
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
          <h1 className="font-black text-3xl">Atualizar Clube</h1>
          <p className="text-center text-gray-400">
            Altere as informações que precisar e salve o formulário no final.
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
              {/* logo */}
              <p className="-mb-4 text-sm">Logo</p>
              {club.logo_url ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={club.logo_url}
                    width={100}
                    height={100}
                    className="border-primary border rounded-full aspect-square"
                    alt="Logo atual"
                    priority
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm leading-4 tracking-tight">
                      Essa é a sua logo atual. Sinta-se a vontade para realizar
                      o upload de uma nova imagem abaixo.
                    </p>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="check"
                        onClick={() => {
                          setRemoveLogo(!removeLogo);
                        }}
                      />
                      <label
                        htmlFor="check"
                        className="peer-disabled:opacity-70 font-medium text-sm leading-none cursor-pointer peer-disabled:cursor-not-allowed"
                      >
                        {removeLogo
                          ? "Sua foto será removida"
                          : "Clique para remover sua foto"}
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${club.id}`}
                    width={100}
                    height={100}
                    className="border-primary border rounded-full aspect-square"
                    alt="Logo atual do clube"
                    unoptimized={true}
                    priority
                  />
                  <p className="text-sm leading-4 tracking-tight">
                    Você não possui nenhuma imagem cadastrada.{" "}
                    <span className="text-primary">
                      Uma imagem aleatória está sendo usada no lugar.
                    </span>{" "}
                    Sinta-se a vontade para realizar o upload de uma nova imagem
                    abaixo.
                  </p>
                </div>
              )}
              <InputImageWithPreview
                name="logo_url"
                selectedImageParentClassname="w-16 h-16"
              />

              {/* background */}
              {club.background.startsWith("http") &&
                form.watch("background") === "image" && (
                  <div className="flex flex-col gap-2">
                    Sua imagem de capa atual
                    <img
                      src={club.background}
                      className="border-primary border rounded-md w-full h-28 object-cover"
                      alt="Capa atual"
                    />
                  </div>
                )}
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
                      <InputImage name="background_url" valueControlBy="form" />
                    ) : (
                      <ColorPicker
                        name="background_color"
                        valueControlBy="form"
                        defaultValue={
                          club.background.startsWith("#")
                            ? club.background
                            : "#fff"
                        }
                      />
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
              <span className="p-0 font-medium text-gray-300 text-sm">
                Se você for aumentar seu plano do básico para o super, pagará
                apenas a diferença de valores, se mantiver no básico, nenhum
                valor será cobrado.
              </span>
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
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar"
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
