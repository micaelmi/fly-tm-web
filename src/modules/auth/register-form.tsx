"use client";
import CheckboxCustomizable from "@/components/form/checkbox-customizable";
import InputDefault from "@/components/form/input-default";
import InputPassword from "@/components/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreateUser } from "@/hooks/use-users";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { PasswordForceGraphic, PasswordForceText } from "./password-force";
import { generateRandomNumber } from "@/lib/utils";

const FormSchema = z
  .object({
    name: z.string().min(5, { message: "O nome deve no mínimo 5 letras." }),
    email: z.string().email({ message: "Digite um e-mail válido." }),
    password: z
      .string()
      .min(8, {
        message: "A senha deve ter no mínimo 8 caracteres",
      })
      .max(32, {
        message: "A senha deve ter no máximo 32 caracteres",
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "A senha deve ter no mínimo 8 caracteres",
      })
      .max(32, {
        message: "A senha deve ter no máximo 32 caracteres",
      }),
    terms: z.boolean().refine((value) => value === true, {
      message: "Aceite os termos e políticas de privacidade.",
    }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "As senhas devem ser iguais.",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const router = useRouter();

  const passwordValue = form.watch("password");

  const { mutate, isPending, isError } = useCreateUser();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const randomNumber = generateRandomNumber().toString();
    const username = data.email.split("@")[0].concat(randomNumber);
    mutate(
      {
        name: data.name,
        username: username,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/register/confirm-email");
        },
      }
    );
  };

  return (
    <Card className="p-14">
      <CardHeader className="flex flex-row gap-4">
        <Image
          src="logo.svg"
          alt="Logo Fly TM"
          width={64}
          height={64}
          priority={true}
        />
        <div>
          <h1 className="text-xl">Crie sua conta no Fly TM</h1>
          <p className="text-gray-400 text-sm">e decole no tênis de mesa!</p>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col">
            <div className="flex flex-col gap-4">
              <InputDefault
                control={form.control}
                name="name"
                label="Nome completo"
                placeholder="Seu nome"
              />
              <InputDefault
                control={form.control}
                name="email"
                label="E-mail"
                type="email"
                placeholder="Seu e-mail"
              />
              <InputPassword
                control={form.control}
                name="password"
                label="Senha"
                placeholder="Crie uma senha forte"
              />
              {passwordValue && (
                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                  <PasswordForceGraphic text={passwordValue} />
                  Força da senha: {PasswordForceText(passwordValue)}
                </div>
              )}
              <InputPassword
                control={form.control}
                name="confirmPassword"
                label="Confirmar senha"
                placeholder="Confirme sua senha"
              />
              <CheckboxCustomizable control={form.control} name="terms">
                Li e concordo com os{" "}
                <a
                  href="#"
                  className="hover:opacity-85 text-primary text-sm underline"
                >
                  termos de uso
                </a>{" "}
                e<br />
                <a
                  href="#"
                  className="hover:opacity-85 text-primary text-sm underline"
                >
                  políticas de privacidade
                </a>
              </CheckboxCustomizable>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-end w-full">
              <a
                href="/login"
                className="hover:opacity-85 text-primary text-sm underline"
              >
                Já tenho uma conta.
              </a>
              <Button type="submit" disabled={!form.getValues("terms")}>
                {isPending ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Criando
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
      {isError && (
        <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
          Erro ao criar conta
        </div>
      )}
    </Card>
  );
}
