"use client";

import { useRef } from "react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export function MovieCarousel({ title, movies, onMovieClick }: MovieCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="py-12 px-6 md:px-12 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">
            {title}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-white/10 hover:border-theme-primary hover:text-theme-primary transition-colors text-white/40"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-white/10 hover:border-theme-primary hover:text-theme-primary transition-colors text-white/40"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div 
              key={movie.id}
              className="relative aspect-[2/3] min-w-[200px] md:min-w-[280px] snap-start group cursor-pointer overflow-hidden rounded-sm bg-zinc-900 border border-white/5"
              onClick={() => onMovieClick(movie)}
            >
              <Image
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-x-0 bottom-0 p-6 space-y-2">
                  <h4 className="text-lg font-black tracking-tighter text-white uppercase leading-none">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-theme-primary uppercase">
                    Ver Detalles <Plus className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
