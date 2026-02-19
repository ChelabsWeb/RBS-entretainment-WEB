"use client";

import { Facebook, Mail, Instagram, MapPin, Phone } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-white/5 bg-black px-6 py-24 md:px-12 md:py-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <div className="relative h-12 w-48 mb-6">
              <Image 
                src="/assets/Logos/RBS logo color.png" 
                alt="RBS Entertainment" 
                fill 
                className="object-contain object-left" 
              />
            </div>
            <div className="mt-8 space-y-4 max-w-md">
              <div className="flex items-start gap-4">
                <MapPin className="h-4 w-4 mt-1 text-white/40 flex-shrink-0" />
                <p className="text-sm font-light leading-relaxed text-white/40 uppercase">
                  Luis A. De Herrera 1284 – WTC Torre 2 of. 1706. Montevideo, Uruguay.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-4 w-4 text-white/40 flex-shrink-0" />
                <p className="text-sm font-light leading-relaxed text-white/40">
                  contacto@rbs.com.uy
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-4 w-4 text-white/40 flex-shrink-0" />
                <p className="text-sm font-light leading-relaxed text-white/40">
                  +598 2622 2222
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12">
             <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20 mb-6">SEGUINOS</h3>
             <div className="flex gap-6">
               <Facebook className="h-6 w-6 cursor-pointer text-white/20 transition-all hover:scale-110 hover:text-white" />
               <Instagram className="h-6 w-6 cursor-pointer text-white/20 transition-all hover:scale-110 hover:text-white" />
               <Mail className="h-6 w-6 cursor-pointer text-white/20 transition-all hover:scale-110 hover:text-white" />
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
          <div className="space-y-6">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20">ESTUDIOS</h3>
            <ul className="space-y-4 text-sm font-bold tracking-tight text-white/40">
              <li className="cursor-pointer transition-colors hover:text-white uppercase">Walt Disney</li>
              <li className="cursor-pointer transition-colors hover:text-white uppercase transition-colors">Universal Studios</li>
              <li className="cursor-pointer transition-colors hover:text-white uppercase transition-colors">Paramount Pictures</li>
              <li className="cursor-pointer transition-colors hover:text-white uppercase transition-colors">UIP Uruguay</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-white/20">MÁS INFO</h3>
            <ul className="space-y-4 text-sm font-bold tracking-tight text-white/40">
              <li><Link href="/" className="hover:text-white transition-colors uppercase">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors uppercase">Quiénes Somos</Link></li>
              <li><Link href="/licensing" className="hover:text-white transition-colors uppercase">Licencias</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors uppercase">Contacto</Link></li>
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
          MADE BY <span style={{ color: theme.primary }} className="transition-colors duration-500">Chelabs</span>
        </p>
      </div>
    </footer>
  );
}
