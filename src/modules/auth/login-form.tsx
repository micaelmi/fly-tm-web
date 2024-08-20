"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import InputPassword from "./input-password";

const FormSchema = z.object({
  email: z.string().email({ message: "O e-mail informado não é valido." }),
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter no mínimo 8 caracteres",
    })
    .max(24),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
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
    router.replace("/dashboard");
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
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu e-mail"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <InputPassword
                          placeholder="Digite sua senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <a
              href="/recover-account"
              className="mt-1 text-sm hover:text-gray-400 underline self-end"
            >
              Esqueci minha senha
            </a>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-end w-full">
              <a
                href="/register"
                className="hover:opacity-85 text-primary text-sm underline"
              >
                Ainda não tem conta? Criar.
              </a>
              <Button type="submit">Entrar</Button>
            </div>
            {error && (
              <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
                {error}
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
