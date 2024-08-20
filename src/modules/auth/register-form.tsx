"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputPassword from "./input-password";
import { PasswordForceGraphic, PasswordForceText } from "./password-force";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import CheckboxDefault from "@/components/form/checkbox-default";
import InputDefault from "@/components/form/input-default";

const FormSchema = z
  .object({
    name: z.string().min(8, { message: "O nome deve no mínimo 8 letras." }),
    email: z.string().email({ message: "O e-mail informado não é valido." }),
    password: z
      .string()
      .min(8, {
        message: "A senha deve ter no mínimo 8 caracteres",
      })
      .max(32),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value === true, {
      message: "Aceite os termos e políticas de privacidade.",
    }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message:
      "As senhas informadas nos campos 'Senha' e 'Confirmar senha' devem ser iguais.",
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
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const passwordValue = form.watch("password");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSending(true);
    try {
      const response = await api.post("users/register", data);
      if (response.status === 201) {
        toast.success("Sucesso! sua conta foi criada!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          router.push("/users/register/confirm-email");
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
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
                placeholder="Digite seu e-mail"
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
              <CheckboxDefault
                control={form.control}
                name="terms"
                label="depois"
              />
              {/* <div>
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            id="terms"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm">
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
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
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
              <Button type="submit">
                {isSending ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Criando
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
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
