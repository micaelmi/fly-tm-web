import Navbar from "@/components/navbar";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

export default async function AuthenticatedLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);
  console.log(session);
  if (!session) {
    redirect("/");
  }
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
