"use client";

import { useTheme } from "@/context/ThemeContext";
import { Facebook } from "lucide-react";

export default function ContactPage() {

  return (
    <main className="min-h-screen bg-black text-white pt-48 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 pb-24">
        <section className="space-y-12">
          <h1 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter leading-[0.8]">
            CONTACTO
          </h1>
          
          <div className="space-y-8 pt-8">
            <div className="space-y-2">
              <p className="text-xs font-black tracking-[0.4em] text-theme-primary uppercase">EMAIL</p>
              <p className="text-2xl font-bold">contacto@rbs.com.uy</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-black tracking-[0.4em] text-theme-primary uppercase">REDES SOCIALES</p>
              <div className="flex gap-6">
                 <a href="#" className="hover:text-theme-primary transition-colors flex items-center gap-2">
                   <Facebook className="h-5 w-5" />
                   <span className="text-sm font-bold tracking-widest uppercase">CINELOVERS</span>
                 </a>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-black tracking-[0.4em] text-theme-primary uppercase">DIRECCIÓN</p>
              <p className="text-lg font-light text-white/60">Montevideo, Uruguay</p>
            </div>
          </div>
        </section>

        <section className="bg-white/5 p-12 rounded-sm border border-white/10">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-black tracking-[0.2em] uppercase text-white/20">NOMBRE</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-white/10 py-2 focus:border-white transition-colors outline-none font-light uppercase tracking-widest text-sm"
                placeholder="TU NOMBRE"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black tracking-[0.2em] uppercase text-white/20">EMAIL</label>
              <input 
                type="email" 
                className="w-full bg-transparent border-b border-white/10 py-2 focus:border-white transition-colors outline-none font-light uppercase tracking-widest text-sm"
                placeholder="TU@EMAIL.COM"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black tracking-[0.2em] uppercase text-white/20">MENSAJE</label>
              <textarea 
                rows={4}
                className="w-full bg-transparent border border-white/10 p-4 focus:border-white transition-colors outline-none font-light uppercase tracking-widest text-sm resize-none"
                placeholder="¿CÓMO PODEMOS AYUDARTE?"
              />
            </div>

            <button 
              className="w-full bg-white py-6 font-black tracking-tighter text-black hover:scale-[1.02] transition-transform uppercase"
            >
              ENVIAR MENSAJE
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
