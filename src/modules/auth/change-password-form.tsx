"use client";
import InputPassword from "@/components/form/input-password";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordForceGraphic, PasswordForceText } from "./password-force";

const FormSchema = z
  .object({
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
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "As senhas devem ser iguais.",
    path: ["confirmPassword"],
  });

export default function ChangePasswordForm() {
  const [error, setError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {};

  return (
    <Card className="p-14">
      <CardHeader className="flex flex-row gap-4">
        <Image
          src="../logo.svg"
          alt="Logo Fly TM"
          width={64}
          height={64}
          priority={true}
        />
        <div>
          <h1 className="text-xl">Criar nova senha</h1>
          <p className="text-gray-400 text-sm">
            redefina sua senha para acessar sua conta.
          </p>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-2">
            <InputPassword
              label="Informe sua nova senha"
              control={form.control}
              placeholder="Digite sua senha"
              name="password"
            />
            {passwordValue && (
              <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                <PasswordForceGraphic text={passwordValue} />
                Força da senha: {PasswordForceText(passwordValue)}
              </div>
            )}
            <InputPassword
              label="Confirme sua nova senha"
              control={form.control}
              placeholder="Digite sua senha"
              name="confirmPassword"
            />
            <Button type="submit" className="w-full">
              Redefinir
            </Button>
            {error && (
              <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
