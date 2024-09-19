import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import TanstackQueryClientWrapper from "@/components/tanstack-query-client-wrapper";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fly TM",
  description: "Uma plataforma de suporte ao mesatenista.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={quicksand.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryClientWrapper>
            <main>{children}</main>
          </TanstackQueryClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
