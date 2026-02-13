"use client";

import { useTheme } from "@/context/ThemeContext";

export default function LicensingPage() {
  const { theme } = useTheme();

  const categories = [
    { title: "WALT DISNEY", subtitle: "CONSUMER PRODUCTS", partner: "Marvel, Star Wars, Pixar" },
    { title: "AUF", subtitle: "EXCLUSIVIDAD", partner: "Asociación Uruguaya de Fútbol" },
    { title: "ME!HUMANITY", subtitle: "BRANDING", partner: "Global Representation" },
    { title: "DISNEY MEDIA", subtitle: "ADS SALES", partner: "Advertising & Solutions" }
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-48 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-24 pb-24">
        <section className="space-y-12 border-b border-white/10 pb-16">
          <h1 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter leading-[0.8]">
            LICENCIAMIENTO <span className="italic font-light">& MARCAS</span>
          </h1>
          <p className="max-w-2xl text-xl font-light text-white/60">
            Gestionamos las franquicias más poderosas del entretenimiento a nivel global, 
            conectando marcas líderes con el mercado uruguayo.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <div 
              key={i}
              className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/5 p-12 transition-all hover:bg-white/10"
            >
              <div 
                className="absolute top-0 right-0 h-32 w-32 opacity-10 transition-transform group-hover:scale-110"
                style={{ backgroundColor: theme.primary, filter: 'blur(60px)' }}
              />
              <p className="text-xs font-black tracking-[0.4em] text-white/20 uppercase mb-4">{cat.subtitle}</p>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">{cat.title}</h2>
              <p className="text-sm font-medium tracking-widest text-white/40 uppercase">{cat.partner}</p>
              
              <div className="mt-8">
                <button 
                  className="rounded-full border border-white/20 px-6 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-theme-primary hover:text-white"
                >
                  MÁS INFORMACIÓN
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
