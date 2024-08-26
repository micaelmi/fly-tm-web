import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperação de conta | Fly TM",
};
export default function RecoverAccountLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex justify-center items-center h-screen">
      {children}
    </section>
  );
}
