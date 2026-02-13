"use client";

import { useState } from "react";
import { Menu, Search, User } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="relative flex flex-col w-full max-w-2xl pointer-events-auto">
        <div 
          className="absolute inset-0 -z-10 rounded-sm transition-colors duration-500 shadow-2xl"
          style={{ backgroundColor: theme.primary }}
        />

        <div className="flex h-12 w-full items-center justify-between px-4" style={{ color: theme.text }}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 hover:opacity-70 transition-opacity">
            <Menu className="h-6 w-6" />
          </button>
          
          <Link href="/" className="text-xl font-black tracking-tighter cursor-pointer flex items-baseline gap-1">
            RBS <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">entertainment</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 cursor-pointer hover:opacity-70 transition-opacity" />
            <User className="h-4 w-4 cursor-pointer hover:opacity-70 transition-opacity" />
          </div>
        </div>
      </nav>

      <div
        className={clsx(
          "fixed inset-0 -z-50 bg-black transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors"
            >
              <Menu className="h-8 w-8 rotate-45" />
            </button>
            {[
              { name: "PELÍCULAS", href: "/#movies" },
              { name: "LICENCIAS", href: "/licensing" },
              { name: "QUIÉNES SOMOS", href: "/about" },
              { name: "CONTACTO", href: "/contact" }
            ].map((item) => (
             <Link
               key={item.name}
               href={item.href}
               className="text-4xl font-black tracking-widest uppercase text-white hover:text-theme-primary transition-colors"
               onClick={() => setIsMenuOpen(false)}
             >
               {item.name}
             </Link>
           ))}
        </div>
      </div>
    </header>
  );
}
