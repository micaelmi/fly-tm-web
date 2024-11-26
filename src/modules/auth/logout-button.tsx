"use client";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await signOut({
      redirect: false,
    });
    router.push("/");
  }

  return (
    <Button
      className="flex justify-center items-center gap-2"
      variant={"outline"}
      onClick={logout}
    >
      <SignOut size={24} />
      Sair da conta
    </Button>
  );
}
