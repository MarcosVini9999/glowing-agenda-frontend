import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BubbleBackground from "@/components/BubbleBackground";
import Image from "next/image";
import logo from "../../docs/img/icon.png";

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
        <main className="relative z-10 container mx-auto">
          <div className="absolute top-4 left-4">
            <Image src={logo} alt="Logo Glowing Agenda" width={250} height={250} priority={true} />
          </div>
          {children}
        </main>
        <BubbleBackground />
      </body>
    </html>
  );
}
