import Navbar from "@/components/navbar";

export default function AuthenticatedLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Navbar />
      <div className="my-8 container">{children}</div>
    </section>
  );
}
