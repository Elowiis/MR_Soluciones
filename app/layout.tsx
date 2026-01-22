import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MR Soluciones Inmobiliarias - Tu hogar, nuestra misión",
  description:
    "Conectamos compradores, vendedores e inversores con las mejores oportunidades inmobiliarias. Encuentra tu propiedad ideal con MR Soluciones Inmobiliarias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="w-full min-w-full overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-w-full overflow-x-hidden`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
