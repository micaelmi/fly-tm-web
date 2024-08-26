"use client";
import InputDefault from "@/components/form/input-default";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({ message: "Digite um e-mail válido." }),
});

export default function RecoverAccountForm() {
  const [error, setError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {};

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
          <h1 className="text-xl">Recuperação de conta</h1>
          <p className="text-gray-400 text-sm">
            informe seu e-mail para prosseguir.
          </p>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-2">
            <InputDefault
              label="E-mail"
              control={form.control}
              placeholder="Digite seu e-mail para recuperação"
              type="email"
              name="email"
            />
            <Button type="submit" className="w-full">
              Continuar
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
