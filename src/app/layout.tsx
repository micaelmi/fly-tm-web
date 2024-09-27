import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import TanstackQueryClientWrapper from "@/components/tanstack-query-client-wrapper";
import NextAuthSessionProvider from "@/providers/session-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Fly TM",
    default: "Fly TM",
  },
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
        <NextAuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TanstackQueryClientWrapper>
              <main>{children}</main>
            </TanstackQueryClientWrapper>
            <ToastContainer position="bottom-right" autoClose={2500} />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
