"use client";
import InputPassword from "@/components/form/input-password";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordForceGraphic, PasswordForceText } from "./password-force";
import { useChangePassword } from "@/hooks/use-users";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";

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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const email = params.get("email");
  const token = params.get("token");
  const id = params.get("id");

  const passwordValue = form.watch("password");

  const { mutate, isSuccess, isPending, isError } = useChangePassword();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (email && token && !isNaN(Number(token)) && id) {
      mutate(
        {
          email: email,
          password: data.password,
          token_number: Number(token),
        },
        {
          onSuccess: () => {
            toast.success("Senha alterada com sucesso!");
          },
        }
      );
    } else {
      toast.error("Algo deu errado, tente novamente.");
    }
  };

  return (
    <>
      {!isSuccess ? (
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
                  {isPending ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Redefinindo
                    </>
                  ) : (
                    "Redefinir"
                  )}
                </Button>
                {isError && (
                  <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
                    Erro ao mudar a senha. Tente novamente.
                  </div>
                )}
              </CardContent>
            </form>
          </Form>
        </Card>
      ) : (
        <div className="text-center">
          <h1 className="text-5xl">Sucesso!</h1>
          <p className="mt-2 mb-4 max-w-xs">
            Sua senha foi alterada, agora volte ao login e entre na sua conta.
          </p>
          <Link
            className={buttonVariants({ variant: "default" })}
            href="/login"
          >
            Ir para o login
          </Link>
        </div>
      )}
    </>
  );
}
