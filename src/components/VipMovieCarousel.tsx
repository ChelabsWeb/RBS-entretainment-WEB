"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Film, Plus } from "lucide-react";

interface VipMovie {
  id: string;
  titulo: string;
  poster_url: string | null;
}

interface VipMovieCarouselProps {
  title: string;
  movies: VipMovie[];
  count: number;
  basePath?: string;
}

export function VipMovieCarousel({ title, movies, count, basePath = "/vip/movies" }: VipMovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setCanScroll(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const offset = direction === "left"
      ? scrollLeft - clientWidth * 0.8
      : scrollLeft + clientWidth * 0.8;
    scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
  };

  if (movies.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <h2 className="text-[11px] font-black tracking-[0.25em] uppercase text-[#4f5ea7] whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[10px] text-white/30 font-bold">{count}</span>
        {canScroll && (
          <div className="flex gap-1">
            <button
              onClick={() => scroll("left")}
              aria-label="Desplazar a la izquierda"
              className="p-1.5 rounded-full border border-white/10 hover:border-[#4f5ea7] hover:text-[#4f5ea7] transition-colors text-white/40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Desplazar a la derecha"
              className="p-1.5 rounded-full border border-white/10 hover:border-[#4f5ea7] hover:text-[#4f5ea7] transition-colors text-white/40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="-mx-4 sm:-mx-6 px-4 sm:px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`${basePath}/${movie.id}`}
            className="relative aspect-[2/3] min-w-[160px] sm:min-w-[180px] md:min-w-[220px] snap-start group cursor-pointer overflow-hidden rounded-sm bg-zinc-900 border border-white/5 flex-shrink-0"
          >
            {movie.poster_url ? (
              <Image
                src={movie.poster_url}
                alt={movie.titulo}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 220px"
              />
            ) : (
              <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                <Film className="h-10 w-10 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-x-0 bottom-0 p-4 space-y-1.5">
                <h4 className="text-sm font-black tracking-tight text-white uppercase leading-tight line-clamp-2">
                  {movie.titulo}
                </h4>
                <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-[#4f5ea7] uppercase">
                  Ver Detalles <Plus className="h-3 w-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
