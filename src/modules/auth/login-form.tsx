"use client";
import CheckboxDefault from "@/components/form/checkbox-default";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  credential: z.string().min(4, { message: "Digite valor válido." }), // username or email
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter no mínimo 8 caracteres",
    })
    .max(32, {
      message: "A senha deve ter no máximo 32 caracteres",
    }),
  rememberMe: z.boolean(),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      credential: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const result = await signIn("credentials", {
      credential: data.credential,
      password: data.password,
      rememberMe: true, // data.rememberMe
      redirect: false,
    });
    if (result?.error) {
      if (result.error == "CredentialsSignin") {
        setError("Login incorreto");
      } else if (result.error == "Request failed with status code 500") {
        setError("Usuário não encontrado ou inativo");
      }
      return;
    }
    router.replace("/home");
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
          <h1 className="text-xl">Fazer login</h1>
          <p className="text-gray-400 text-sm">
            acesse já sua conta no Fly TM!
          </p>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col">
            <div className="flex flex-col gap-4">
              <InputDefault
                control={form.control}
                name="credential"
                label="E-mail ou nome de usuário"
                type="text"
                placeholder="Seu e-mail ou nome de usuário"
              />
              <InputPassword
                control={form.control}
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
              />
            </div>
            <a
              href="/recover-account"
              className="mt-1 text-sm hover:text-gray-400 underline self-end"
            >
              Esqueci minha senha
            </a>
            {/* <CheckboxDefault
              control={form.control}
              name="rememberMe"
              label="Lembrar de mim"
            /> */}
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <a
                href="/register"
                className="hover:opacity-85 text-primary text-sm underline"
              >
                Ainda não tem conta? Criar.
              </a>
              <Button type="submit">Entrar</Button>
            </div>
          </CardFooter>
          {error && (
            <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
              {error}
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
