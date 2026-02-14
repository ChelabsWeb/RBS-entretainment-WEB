"use client";

import { useTheme } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-theme-primary selection:text-black">
      <Navbar />
      <div className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 
          className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.8] transition-colors duration-1000 mb-12"
          style={{ color: theme.primary }}
        >
          Nosotros
        </h1>
        <div className="space-y-20">
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl font-black uppercase tracking-widest opacity-20">RBS Vision</span>
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Nuestra Historia</h2>
              <p className="text-xl text-white/60 leading-relaxed">
                RBS Entertainment nació con la visión de llevar el mejor cine internacional a las audiencias uruguayas. Con décadas de experiencia, nos hemos consolidado como un referente en la distribución de cine de calidad.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
