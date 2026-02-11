import type { Metadata } from "next";
import { Geist_Mono, Geist, Syne } from "next/font/google";
import { Toaster } from "sonner";
import { Footer } from "@/components/Footer";
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
  title: "VelocityHunt - Discover Exploding Repos",
  description: "Discover exploding GitHub repositories before they go viral — instant insights, velocity-based ranking, and ready-to-share X posts.",
  openGraph: {
    title: "VelocityHunt - Discover Exploding GitHub Repos",
    description: "Find the next Spark ⚡ Real-time velocity tracking of trending repositories before they go viral.",
    url: "https://velocityhunt.vercel.app",
    siteName: "VelocityHunt",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "VelocityHunt - Discover exploding GitHub repositories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VelocityHunt - Discover Exploding GitHub Repos",
    description: "Find the next Spark ⚡ Real-time velocity tracking of trending repositories.",
    images: ["/og.png"],
    creator: "@PipolmPk",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={ {
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "VelocityHunt",
              "operatingSystem": "Web",
              "applicationCategory": "DeveloperApplication",
              "description": "Discover exploding GitHub repositories before they go viral.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Philippe"
              }
            })
          } }
        />
        <div className="min-h-screen w-full relative bg-black">
          {/* X Organizations Black Background with Top Glow */ }
          <div
            className="absolute inset-0 z-0"
            style={ {
              background: "radial-gradient(ellipse 80% 16% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
            } }
          />

          {/* Your Content/Components */ }
          <div className="relative z-10 flex flex-col min-h-screen">
            <div className="flex-1">
              { children }
            </div>
            <Footer />
          </div>
        </div>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
