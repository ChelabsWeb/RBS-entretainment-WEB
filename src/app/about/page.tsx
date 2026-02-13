"use client";

import { useTheme } from "@/context/ThemeContext";

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-black text-white pt-48 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-24 pb-24">
        <section className="space-y-8">
          <h1 className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.8]">
            QUIÉNES <span className="italic font-light">SOMOS</span>
          </h1>
          <p 
            className="text-sm font-bold tracking-[0.4em] uppercase"
            style={{ color: theme.primary }}
          >
            ESTABLECIDOS EN 1997
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="space-y-8">
            <p className="text-2xl font-light leading-relaxed text-white/60">
              RBS Entertainment inició sus operaciones en Enero de 1997, 
              consolidándose como el principal distribuidor de cine y 
              productos de consumo en Uruguay.
            </p>
            <p className="text-lg font-light leading-relaxed text-white/40">
              Somos representantes exclusivos de **The Walt Disney Company** 
              para cine y Consumer Products. Desde 1999, representamos a 
              **United International Pictures (UIP)**, que engloba a los 
              estudios **Universal Studios** y **Paramount Pictures**.
            </p>
          </div>

          <div className="space-y-12">
            <div className="border-t border-white/10 pt-8 space-y-4">
              <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20">PARTNERS</h3>
              <ul className="space-y-2 text-xl font-bold uppercase tracking-tight">
                <li>Disney Media</li>
                <li>AUF (Asociación Uruguaya de Fútbol)</li>
                <li>Me!Humanity</li>
                <li>Marvel / Star Wars / Pixar</li>
              </ul>
            </div>

            <div className="border-t border-white/10 pt-8 space-y-4">
              <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20">UBICACIÓN</h3>
              <p className="text-xl font-bold uppercase tracking-tight">Montevideo, Uruguay</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
