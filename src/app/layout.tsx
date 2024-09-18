import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BubbleBackground from "@/components/BubbleBackground";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Glowing Agenda",
    description: "Agende seu horário de forma rápida e prática com a Glowing Agenda.",
    authors: [
      { name: "Marcos Vinicius Andrade de Sousa", url: "marcosviniciusandradedesousa@hotmail.com" },
    ],
    applicationName: "Glowing Agenda",
    keywords: ["Agenda", "Glowing", "Agendamento"],
    generator: "Next.js",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="relative z-10 container mx-auto p-4">{children}</main>
        <BubbleBackground />
      </body>
    </html>
  );
}
