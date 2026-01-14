import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Spark Generator - Discover Exploding Repos",
  description: "Discover exploding GitHub repositories before they go viral — instant insights, velocity-based ranking, and ready-to-share X posts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistMono.variable} font-mono antialiased bg-zinc-950 text-zinc-50`}
      >
        {children}
      </body>
    </html>
  );
}
