import { Button } from "@/components/ui/button";
import { UsersList } from "@/modules/users/users-list";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <>
      <h1 className="py-6 text-2xl">Fly TM - Landing Page</h1>

      <Link href="/login">
        <Button>Acessar página de login</Button>
      </Link>

      <UsersList />
    </>
  );
}
