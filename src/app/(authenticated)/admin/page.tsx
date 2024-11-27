"use client";
import Navbar from "@/components/navbar";
import ContactList from "@/modules/admin/contact-list";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();
  const type = useSession().data?.payload.type;

  if (type !== 2) {
    router.back();
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-4 my-8 px-2 container">
        <h1 className="font-semibold text-3xl">Página do Administrador</h1>
        <ContactList />
      </div>
    </>
  );
}
