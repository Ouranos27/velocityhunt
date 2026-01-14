import type { Metadata } from "next";
import { Geist_Mono, Geist, Syne } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"]
})

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={ `${geistMono.variable} ${geistSans.variable} ${syne.variable} font-mono antialiased text-zinc-50` }
      >
        <div className="min-h-screen w-full relative bg-black">
          {/* X Organizations Black Background with Top Glow */ }
          <div
            className="absolute inset-0 z-0"
            style={ {
              background: "radial-gradient(ellipse 80% 16% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
            } }
          />

          {/* Your Content/Components */ }
          <div className="relative z-10">
            { children }
          </div>
        </div>
      </body>
    </html>
  );
}
