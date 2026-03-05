import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vouky | Sistema de Gestão de Usuários",
  description: "Interface premium para gerenciamento de usuários ativos e inativos.",
};

import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
