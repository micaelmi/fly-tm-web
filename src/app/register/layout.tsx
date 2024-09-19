import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro | Fly TM",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="container">{children}</section>;
}
