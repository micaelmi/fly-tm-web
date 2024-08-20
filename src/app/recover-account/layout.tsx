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
