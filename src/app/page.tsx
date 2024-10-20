"use client";

import { Button } from "@/components/ui/button";
import { UsersList } from "@/modules/users/users-list";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { nextAuthOptions } from "./api/auth/[...nextauth]/auth";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <section className="container">
      <h1 className="py-6 text-2xl">Fly TM - Landing Page</h1>

      <Link href="/login">
        <Button>Acessar página de login</Button>
      </Link>

      <UsersList />
    </section>
  );
}
