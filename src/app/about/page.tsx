"use client";

import { useTheme } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-theme-primary selection:text-black">
      <Navbar />
      <div className="pt-40 pb-20 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-center transition-colors duration-1000"
          style={{ color: theme.primary }}
        >
          En Construcción
        </h1>
        <p className="text-xl text-white/60 text-center uppercase tracking-widest">
          Próximamente disponible
        </p>
      </div>
      <Footer />
    </main>
  );
}
