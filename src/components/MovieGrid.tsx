"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Loader2, Star, Calendar, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { fetchPopularMovies, getImageUrl, Movie } from "@/lib/tmdb";
import { MovieDetailModal } from "./MovieDetailModal";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const THEME_COLORS = ["#4f5ea7", "#cb3088", "#e5361f", "#ec7312", "#fcbf2d", "#2ba137"];

function MovieCard({ 
  movie, 
  index, 
  onClick,
  isModalOpen
}: { 
  movie: Movie; 
  index: number;
  onClick: () => void;
  isModalOpen: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();
  const themeColor = THEME_COLORS[index % THEME_COLORS.length];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isModalOpen) {
          setTheme({
            primary: themeColor,
            secondary: "#000000",
            text: "#000000",
          });
        }
      },
      { threshold: 0.6 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [movie, setTheme, themeColor, isModalOpen]);

  return (
    <div 
      ref={cardRef} 
      className="group flex flex-col md:flex-row gap-8 cursor-pointer items-start p-6 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500" 
      onClick={onClick}
    >
      {/* Horizontal Image Section */}
      <div className="relative aspect-[2/3] w-full md:w-64 shrink-0 overflow-hidden rounded-sm bg-zinc-900 shadow-2xl">
        <Image
          src={getImageUrl(movie.poster_path, "w500")}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/40 backdrop-blur-sm">
          <div className="h-14 w-14 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
            <Plus className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Horizontal Content Section */}
      <div className="flex-1 space-y-6 py-2">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black tracking-[0.4em] uppercase text-theme-primary transition-colors">
                #0{index + 1}
             </span>
             <div className="h-[1px] w-8 bg-white/10" />
             <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                <Calendar className="h-3 w-3" />
                {movie.release_date.split("-")[0]}
             </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none group-hover:text-theme-primary transition-colors">
            {movie.original_title}
          </h3>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-theme-primary text-theme-primary" />
              <span className="text-sm font-black tracking-tighter text-white">
                {movie.vote_average.toFixed(1)}
              </span>
           </div>
           <div className="h-4 w-[1px] bg-white/10" />
           <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20">
              International Sensations
           </span>
        </div>

        <p className="text-lg font-light leading-relaxed text-white/50 max-w-3xl">
          {movie.overview}
        </p>

        <div className="pt-4 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-white/20 group-hover:text-theme-primary transition-colors">
            VER DETALLES <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedThemeColor, setSelectedThemeColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchPopularMovies();
        setMovies(data.slice(0, 10)); // Adjusted count for list view
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  if (loading) {
    return (
      <section id="movies" className="bg-black py-48 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin opacity-20" />
      </section>
    );
  }

  return (
    <section id="movies" className="bg-black py-32 px-6 md:px-12 border-t border-white/5">
      <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-12">
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-[0.6em] uppercase text-white/40">
            CATÁLOGO 2026
          </h2>
          <p className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
            SENSACIONES <br />
            <span className="italic font-light text-theme-primary transition-colors duration-1000">GLOBALES</span>
          </p>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/20 mb-4 max-w-xs">
              EXPLORA NUESTRA SELECCIÓN CURADA DE LOS MEJORES ESTRENOS INTERNACIONALES.
           </p>
           <button className="text-xs font-black tracking-[0.3em] uppercase text-white/40 transition-colors hover:text-theme-primary border-b-2 border-white/5 pb-1">
            VER TODAS LAS PELÍCULAS
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            index={index} 
            isModalOpen={!!selectedMovie}
            onClick={() => {
              setSelectedMovie(movie);
              setSelectedThemeColor(THEME_COLORS[index % THEME_COLORS.length]);
            }}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-24 flex justify-center">
        <button className="group relative px-12 py-6 rounded-full overflow-hidden border border-white/10 transition-all hover:border-theme-primary">
            <span className="relative z-10 text-xs font-black tracking-[0.4em] uppercase text-white group-hover:text-black transition-colors">
              CARGAR MÁS ESTRENOS
            </span>
            <div className="absolute inset-0 -z-0 bg-theme-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
        </button>
      </div>

      <MovieDetailModal 
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
