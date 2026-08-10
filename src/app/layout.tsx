import type { Metadata } from "next";
import StarsBackground from "../components/atoms/stars-atom/stars-atom";
import { MusicProvider } from "../components/providers/music-provider";
import { SmoothScrollProvider } from "../components/providers/smooth-scroll-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SETI 2026",
  description: "Semana de Estudos em Tecnologia e Informatica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="relative antialiased">
        <StarsBackground className="pointer-events-none fixed inset-0 z-[1]" />
        <MusicProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </MusicProvider>
      </body>
    </html>
  );
}
