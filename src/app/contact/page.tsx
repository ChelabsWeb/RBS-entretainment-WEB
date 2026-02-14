"use client";

import { useTheme } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-theme-primary selection:text-black">
      <Navbar />
      <div className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 
          className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.8] transition-colors duration-1000 mb-12"
          style={{ color: theme.primary }}
        >
          Contacto
        </h1>
        <div className="grid md:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 mb-4">Ubicación</h3>
              <p className="text-2xl font-black uppercase tracking-tighter">Montevideo, Uruguay</p>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 mb-4">Email</h3>
              <p className="text-2xl font-black uppercase tracking-tighter">info@rbs.com.uy</p>
            </div>
          </div>
          <form className="space-y-6">
            <input 
              type="text" 
              placeholder="NOMBRE" 
              className="w-full bg-transparent border-b border-white/10 py-4 font-black uppercase tracking-widest focus:border-theme-primary outline-none transition-colors"
            />
            <input 
              type="email" 
              placeholder="EMAIL" 
              className="w-full bg-transparent border-b border-white/10 py-4 font-black uppercase tracking-widest focus:border-theme-primary outline-none transition-colors"
            />
            <textarea 
              placeholder="MENSAJE" 
              rows={4}
              className="w-full bg-transparent border-b border-white/10 py-4 font-black uppercase tracking-widest focus:border-theme-primary outline-none transition-colors"
            />
            <button 
              className="px-12 py-4 font-black uppercase tracking-widest border transition-all duration-300 hover:bg-theme-primary hover:text-white"
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
