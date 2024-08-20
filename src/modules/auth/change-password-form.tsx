"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import InputPassword from "./input-password";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "A senha deve ter no mínimo 8 caracteres",
      })
      .max(32),
    confirmPassword: z.string(),
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
          <h1 className="text-xl">Troca de senha</h1>
          <p className="text-gray-400 text-sm">redefina sua senha.</p>
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
