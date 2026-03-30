import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: {
    template: "%s | RBS Entertainment",
    default: "RBS Entertainment",
  },
  description:
    "RBS Entertainment es agencia especializada en distribución y licenciamiento cinematográfico en Uruguay. Representantes de Disney, Universal Studios y Paramount Pictures.",
  keywords: [
    "RBS Entertainment",
    "RBS Cinema",
    "cine Uruguay",
    "distribución cinematográfica",
    "películas",
    "estrenos",
    "Disney",
    "Universal Studios",
    "Paramount Pictures",
    "licencias cinematográficas",
  ],
  authors: [{ name: "RBS Entertainment" }],
  creator: "RBS Entertainment",
  metadataBase: new URL("https://rbsentertainment.com.uy"),
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: "RBS Entertainment",
    title: "RBS Entertainment",
    description:
      "Agencia especializada en distribución y licenciamiento cinematográfico en Uruguay. Representantes de Disney, Universal Studios y Paramount Pictures.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RBS Entertainment",
    description:
      "Agencia especializada en distribución y licenciamiento cinematográfico en Uruguay.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/context/ThemeContext";
import { CustomScrollbar } from "@/components/CustomScrollbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <ThemeProvider>
          <CustomScrollbar />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
