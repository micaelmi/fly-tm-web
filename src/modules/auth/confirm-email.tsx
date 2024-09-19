"use client";
import { Mailbox, UserCheck } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

export default function ConfirmEmail() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const userId = params.get("userId");
  const status = params.get("status");
  return (
    <div>
      {userId && status ? (
        <div className="flex flex-col justify-center items-center gap-2 w-full h-screen">
          <UserCheck className="text-9xl text-green-400" />
          <h1 className="mb-4 max-w-md text-3xl text-center">
            E-mail confirmado!
          </h1>
          <Link
            className={buttonVariants({ variant: "default" })}
            href="/login"
          >
            Acessar página de login
          </Link>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 w-full h-screen">
          <Mailbox className="text-9xl text-primary" />
          <h1 className="max-w-md text-3xl text-center">
            Verifique seu e-mail para confirmar a criação da sua conta.
          </h1>
        </div>
      )}
    </div>
  );
}
