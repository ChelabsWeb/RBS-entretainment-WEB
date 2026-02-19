"use client";

import { useTheme } from "@/context/ThemeContext";
import clsx from "clsx";

export function ContactSection() {
  const { theme } = useTheme();

  return (
    <section className="py-24 px-6 flex justify-center bg-black">
      <div 
        className="w-full max-w-2xl p-12 rounded-sm shadow-2xl relative overflow-hidden transition-all duration-500"
        style={{ backgroundColor: theme.primary + '10', border: `1px solid ${theme.primary}20` }}
      >
        {/* Decorative background glow */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 blur-[100px] opacity-20 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />

        <div className="relative z-10">
          <h2 
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-12 transition-colors duration-1000"
            style={{ color: theme.primary }}
          >
            Contacto
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2 text-primary transition-colors duration-1000" style={{ color: theme.primary }}>Ubicación</h3>
                <p className="text-sm font-black uppercase tracking-tighter text-white leading-snug">
                  Luis A. De Herrera 1284 – WTC Torre 2 of. 1706. Montevideo, Uruguay.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2 text-primary transition-colors duration-1000" style={{ color: theme.primary }}>Email</h3>
                  <p className="text-lg font-black uppercase tracking-tighter text-white">contacto@rbs.com.uy</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2 text-primary transition-colors duration-1000" style={{ color: theme.primary }}>Teléfono</h3>
                  <p className="text-lg font-black uppercase tracking-tighter text-white">+598 2622 2222</p>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="NOMBRE" 
                className="w-full bg-transparent border-b border-white/10 py-3 text-[11px] font-black uppercase tracking-widest focus:border-theme-primary outline-none transition-colors placeholder:text-white/20"
              />
              <input 
                type="email" 
                placeholder="EMAIL" 
                className="w-full bg-transparent border-b border-white/10 py-3 text-[11px] font-black uppercase tracking-widest focus:border-theme-primary outline-none transition-colors placeholder:text-white/20"
              />
              <textarea 
                placeholder="MENSAJE" 
                rows={3}
                className="w-full bg-transparent border-b border-white/10 py-3 text-[11px] font-black uppercase tracking-widest focus:border-theme-primary outline-none transition-colors placeholder:text-white/20 resize-none"
              />
              <div className="pt-4">
                <button 
                  type="button"
                  className="w-full py-3 text-[11px] font-black uppercase tracking-[0.3em] border transition-all duration-300 hover:bg-theme-primary hover:text-white"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
