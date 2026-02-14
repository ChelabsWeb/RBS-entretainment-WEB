"use client";

import { useTheme } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LicensingPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-theme-primary selection:text-black">
      <Navbar />
      <div className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 
          className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.8] transition-colors duration-1000 mb-12"
          style={{ color: theme.primary }}
        >
          Licencias
        </h1>
        <div className="grid md:grid-cols-2 gap-20">
          <div className="space-y-6 text-xl text-white/60 leading-relaxed">
            <p>
              RBS Entertainment gestiona un catálogo diverso de contenido cinematográfico para múltiples plataformas y territorios.
            </p>
            <p>
              Ofrecemos soluciones integrales para la adquisición de derechos de exhibición, distribución y formatos para cine, televisión y streaming.
            </p>
          </div>
          <div className="border border-white/10 p-12 flex flex-col justify-between">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Consulta de Derechos</h3>
            <p className="text-white/40 mb-12">Si estás interesado en licenciar alguno de nuestros títulos, contacta con nuestro departamento comercial.</p>
            <button 
              className="w-full py-4 text-center font-black uppercase tracking-widest border transition-all duration-300 hover:bg-theme-primary hover:text-white"
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              Contactar Ventas
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
