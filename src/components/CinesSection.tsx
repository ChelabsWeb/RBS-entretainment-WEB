"use client";

import { useTheme } from "@/context/ThemeContext";
import { MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";

const CINEMA_EXHIBITORS = [
  {
    name: "Life Cinemas",
    description: "Múltiples salas en todo el país con la mejor tecnología.",
    locations: ["Montevideo", "Canelones", "Maldonado"],
    color: "#e5361f",
    short: "LIFE",
    logo: "/assets/Logos/exhibitors/life-cinemas.png",
    website: "#",
  },
  {
    name: "Cinemateca Uruguaya",
    description: "Cine arte y películas de autor en un espacio cultural único.",
    locations: ["Montevideo Centro"],
    color: "#4f5ea7",
    short: "CIMT",
    logo: "/assets/Logos/exhibitors/cinemateca.png",
    website: "#",
  },
  {
    name: "Hoyts",
    description: "Experiencia premium con salas IMAX y sonido Dolby Atmos.",
    locations: ["Montevideo Shopping", "Tres Cruces"],
    color: "#cb3088",
    short: "HOYTS",
    logo: "/assets/Logos/exhibitors/hoyts.png",
    website: "#",
  },
  {
    name: "Cines del Este",
    description: "La referencia cinematográfica en la costa este uruguaya.",
    locations: ["Maldonado", "Punta del Este", "Rocha"],
    color: "#2ba137",
    short: "ESTE",
    logo: "/assets/Logos/exhibitors/cines-del-este.png",
    website: "#",
  },
];

export function CinesSection() {
  const { theme } = useTheme();

  return (
    <section className="bg-black py-32 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 border-b border-white/10 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.6em] uppercase text-white/40">
                EXHIBIDORES
              </h2>
              <p className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                <span className="font-light text-white/50">NUESTROS</span> <br />
                <span style={{ color: theme.primary }} className="transition-colors duration-1000">
                  CINES
                </span>
              </p>
            </div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/20 max-w-xs md:text-right">
              ENCONTRÁ LAS PELÍCULAS RBS EN LOS MEJORES COMPLEJOS DEL PAÍS.
            </p>
          </div>
        </div>

        {/* Cinema Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CINEMA_EXHIBITORS.map((cinema) => (
            <div
              key={cinema.name}
              className="group relative flex flex-col gap-6 p-6 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
            >
              {/* Color accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 group-hover:h-1"
                style={{ backgroundColor: cinema.color }}
              />

              {/* Exhibitor Logo */}
              <div className="w-12 h-12 rounded-sm flex items-center justify-center overflow-hidden bg-white/5">
                <Image
                  src={cinema.logo}
                  alt={`${cinema.name} logo`}
                  width={48}
                  height={48}
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to text if logo not found
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.backgroundColor = cinema.color;
                      parent.innerHTML = `<span class="text-white text-xs font-black tracking-tight">${cinema.short}</span>`;
                    }
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-black tracking-tighter uppercase text-white group-hover:text-theme-primary transition-colors duration-300">
                  {cinema.name}
                </h3>
                <p className="text-xs font-light leading-relaxed text-white/40">
                  {cinema.description}
                </p>
              </div>

              {/* Locations */}
              <div className="space-y-2">
                {cinema.locations.map((loc) => (
                  <div key={loc} className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-white/20 flex-shrink-0" />
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30">
                      {loc}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={cinema.website}
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-white/20 hover:text-white transition-colors duration-300 group/link"
              >
                VER CARTELERA
                <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
