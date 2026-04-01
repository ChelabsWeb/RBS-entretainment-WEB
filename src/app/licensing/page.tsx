"use client";

import { useTheme } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Construction } from "lucide-react";

export default function LicensingPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <Construction className="h-12 w-12 mb-6" style={{ color: theme.primary }} />
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4"
          style={{ color: theme.primary }}
        >
          Licencias
        </h1>
        <p className="text-white/40 text-sm uppercase tracking-widest">
          Sección en construcción
        </p>
      </div>
      <Footer />
    </main>
  );
}
