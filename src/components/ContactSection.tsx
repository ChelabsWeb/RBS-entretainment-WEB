"use client";

import { useTheme } from "@/context/ThemeContext";
import clsx from "clsx";

export function ContactSection() {
  const { theme } = useTheme();

  return (
    <section id="contacto" className="py-24 px-6 flex justify-center bg-black">
      <div 
        className="w-full max-w-2xl p-12 rounded-sm shadow-2xl relative overflow-hidden transition-all duration-500"
        style={{ backgroundColor: theme.primary + '10', border: `1px solid ${theme.primary}20` }}
      >
        {/* Decorative background glow */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 blur-[100px] opacity-20 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center py-20">
          <h2 
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6 text-center transition-colors duration-1000"
            style={{ color: theme.primary }}
          >
            En Construcción
          </h2>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-white/40 text-center">
            Próximamente disponible
          </p>
        </div>
      </div>
    </section>
  );
}
