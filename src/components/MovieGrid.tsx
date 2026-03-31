"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Loader2, Calendar, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { fetchNowPlayingMovies, fetchUpcomingMovies, getImageUrl, Movie, searchMovie } from "@/lib/movies";
import { MovieDetailModal } from "./MovieDetailModal";
import Link from "next/link";
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
      <div className="relative aspect-[2/3] w-[60%] mx-auto md:mx-0 md:w-64 shrink-0 overflow-hidden rounded-sm bg-zinc-900 shadow-2xl">
        <Image
          src={getImageUrl(movie.poster_path, "w500")}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 60vw, 256px"
          quality={100}
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
                #{(index + 1).toString().padStart(2, '0')}
             </span>
             <div className="h-[1px] w-8 bg-white/10" />
             <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                <Calendar className="h-3 w-3" />
                {movie.release_date}
             </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none group-hover:text-theme-primary transition-colors">
            {movie.title}
          </h3>
        </div>

        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40">
              {movie.release_date ? movie.release_date.split("-")[0] : ""}
           </span>
        </div>

        <p className="text-lg font-light leading-relaxed text-white/50 max-w-3xl">
          {movie.overview}
        </p>

        <div className="pt-4 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-white/40 group-hover:text-theme-primary transition-colors">
            VER DETALLES <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function MovieGrid({ enCartelTitles, proximamenteTitles }: { enCartelTitles?: string[]; proximamenteTitles?: string[] }) {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<"en_cartel" | "proximamente">("en_cartel");
  const [visibleLimit, setVisibleLimit] = useState(6);
  const [loading, setLoading] = useState(true);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number | null>(null);

  // Cada vez que cambiamos de pestaña, devolvemos el límite a 6
  useEffect(() => {
    setVisibleLimit(6);
  }, [activeTab]);

  useEffect(() => {
    async function loadMovies() {
      try {
        let curatedNowPlaying: Movie[] = [];
        let curatedUpcoming: Movie[] = [];

        if (enCartelTitles && enCartelTitles.length > 0) {
          const results = await Promise.all(
            enCartelTitles.map(async (title) => {
              const res = await searchMovie(title);
              return res?.[0];
            })
          ).then(res => res.filter(Boolean) as Movie[]);
          curatedNowPlaying = results;
        } else {
          curatedNowPlaying = await fetchNowPlayingMovies();
        }

        if (proximamenteTitles && proximamenteTitles.length > 0) {
          const results = await Promise.all(
            proximamenteTitles.map(async (title) => {
              const res = await searchMovie(title);
              return res?.[0];
            })
          ).then(res => res.filter(Boolean) as Movie[]);
          curatedUpcoming = results;
        } else {
          curatedUpcoming = await fetchUpcomingMovies();
        }

        // Ordenar cronológicamente
        const sortByDate = (a: Movie, b: Movie) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime();

        setNowPlaying(curatedNowPlaying.sort(sortByDate));
        setUpcoming(curatedUpcoming.sort(sortByDate));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [enCartelTitles, proximamenteTitles]);

  if (loading) {
    return (
      <section id="movies" className="bg-black py-32 px-6 md:px-12 border-t border-white/5 min-h-[600px] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin opacity-20" />
      </section>
    );
  }

  const displayedMovies = activeTab === "en_cartel" ? nowPlaying : upcoming;

  return (
    <section id="movies" className="bg-black py-32 px-6 md:px-12 border-t border-white/5">
      <div className="mb-24 flex flex-col gap-12 border-b border-white/10 pb-12">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-sm font-bold tracking-[0.6em] uppercase text-white/50">
            CATÁLOGO 2026
          </h2>
          
          {/* Custom Tabs Toggle */}
          <div className="inline-flex items-center self-start md:self-auto rounded-full border border-white/10 p-1 bg-white/5">
            <button
              onClick={() => setActiveTab("en_cartel")}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                activeTab === "en_cartel" 
                  ? "bg-theme-primary text-white shadow-lg" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              En Cartel
            </button>
            <button
              onClick={() => setActiveTab("proximamente")}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                activeTab === "proximamente" 
                  ? "bg-theme-primary text-white shadow-lg" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              Próximamente
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-8 text-center w-full">
          <p className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
            <span className="font-light text-white/50">{activeTab === "en_cartel" ? "CARTELERA" : "FUTUROS"}</span> <br />
            <span className="text-theme-primary transition-colors duration-1000">
              {activeTab === "en_cartel" ? "ACTUAL" : "ESTRENOS"}
            </span>
          </p>
          
          <div className="space-y-4 flex flex-col items-center">
             <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 max-w-md">
                EXPLORA NUESTRO CATÁLOGO ORDENADO POR FECHA DE LANZAMIENTO.
             </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {displayedMovies.length > 0 ? displayedMovies.slice(0, visibleLimit).map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${activeTab}`}
            movie={movie}
            index={index}
            isModalOpen={selectedMovieIndex !== null}
            onClick={() => setSelectedMovieIndex(index)}
          />
        )) : (
          <div className="text-center py-20 opacity-50 text-white font-bold tracking-widest uppercase text-sm">
            NO HAY PELÍCULAS PARA MOSTRAR EN ESTA SECCIÓN
          </div>
        )}
      </div>

      {/* Load More or View All Movies Button */}
      {displayedMovies.length > 6 && (
        <div className="mt-24 flex justify-center">
          {visibleLimit < displayedMovies.length ? (
            <button
              onClick={() => setVisibleLimit(prev => prev + 6)}
              className="group relative inline-flex items-center justify-center px-8 md:px-12 py-5 md:py-6 rounded-full overflow-hidden border border-white/10 transition-all hover:border-theme-primary text-center"
            >
                <span className="relative z-10 text-xs font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-white group-hover:text-black transition-colors whitespace-nowrap">
                  VER MÁS PELÍCULAS
                </span>
                <div className="absolute inset-0 -z-0 bg-theme-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
            </button>
          ) : (
            <Link
              href="/peliculas"
              className="group relative inline-flex items-center justify-center px-8 md:px-12 py-5 md:py-6 rounded-full overflow-hidden border border-white/10 transition-all hover:border-theme-primary text-center"
            >
                <span className="relative z-10 text-xs font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-white group-hover:text-black transition-colors whitespace-nowrap">
                  VER CATÁLOGO COMPLETO
                </span>
                <div className="absolute inset-0 -z-0 bg-theme-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
            </Link>
          )}
        </div>
      )}

      <MovieDetailModal
        movie={selectedMovieIndex !== null ? displayedMovies[selectedMovieIndex] : null}
        isOpen={selectedMovieIndex !== null}
        onClose={() => setSelectedMovieIndex(null)}
        movies={displayedMovies}
        currentIndex={selectedMovieIndex ?? 0}
        onNavigate={(_, idx) => setSelectedMovieIndex(idx)}
      />
    </section>
  );
}

