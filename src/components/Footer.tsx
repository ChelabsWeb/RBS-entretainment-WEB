"use client";

import { Facebook, Mail } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-white/5 bg-black px-6 py-24 md:px-12 md:py-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-white flex items-baseline gap-1">
              RBS <span className="text-xs font-bold tracking-widest uppercase opacity-40">entertainment</span>
            </h2>
            <p className="mt-6 max-w-sm text-lg font-light leading-relaxed text-white/40">
              DISTRIBUIDOR LÍDER DE CINE Y LICENCIAS EN URUGUAY DESDE 1997. 
              REPRESENTANTES EXCLUSIVOS DE THE WALT DISNEY COMPANY Y UIP.
            </p>
          </div>
          <div className="mt-12 flex gap-6">
            <Facebook className="h-6 w-6 cursor-pointer text-white/20 transition-all hover:scale-110 hover:text-white" />
            <Mail className="h-6 w-6 cursor-pointer text-white/20 transition-all hover:scale-110 hover:text-white" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
          <div className="space-y-6">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20">ESTUDIOS</h3>
            <ul className="space-y-4 text-sm font-bold tracking-tight text-white/40">
              <li className="cursor-pointer transition-colors hover:text-white uppercase transition-colors">Walt Disney</li>
              <li className="cursor-pointer transition-colors hover:text-white uppercase transition-colors">Universal Studios</li>
              <li className="cursor-pointer transition-colors hover:text-white uppercase transition-colors">Paramount Pictures</li>
              <li className="cursor-pointer transition-colors hover:text-white uppercase transition-colors">UIP Uruguay</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20">EMPRESA</h3>
            <ul className="space-y-4 text-sm font-bold tracking-tight text-white/40">
              <li><Link href="/about" className="hover:text-white transition-colors">QUIÉNES SOMOS</Link></li>
              <li><Link href="/licensing" className="hover:text-white transition-colors">LICENCIAS</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">CONTACTO</Link></li>
            </ul>
          </div>
          <div className="col-span-2 space-y-6 md:col-span-1">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20">LEGAL</h3>
            <ul className="space-y-4 text-sm font-bold tracking-tight text-white/40">
              <li className="cursor-pointer transition-colors hover:text-white uppercase">Privacidad</li>
              <li className="cursor-pointer transition-colors hover:text-white uppercase">Términos</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-32 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-12 text-[10px] font-black tracking-[0.3em] uppercase text-white/10 md:flex-row">
        <p>© 2026 RBS ENTERTAINMENT URUGUAY. TODOS LOS DERECHOS RESERVADOS.</p>
        <p className="flex items-center gap-2">
          MADE BY <span style={{ color: theme.primary }} className="transition-colors duration-500">ANTIGRAVITY</span>
        </p>
      </div>
    </footer>
  );
}
