import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <>
      <h1 className="mb-5">Landing Page</h1>

      <Link href="/login">
        <Button>Acessar página de login</Button>
      </Link>
    </>
  );
}
