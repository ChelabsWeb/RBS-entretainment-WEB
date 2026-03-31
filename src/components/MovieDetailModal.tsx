"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchMovieDetails, getImageUrl, Movie } from "@/lib/movies";
import { Star, Calendar, Users, Loader2, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
  movies?: Movie[];
  currentIndex?: number;
  onNavigate?: (movie: Movie, index: number) => void;
}

interface TMDBMovieDetails {
  videos?: {
    results: {
      type: string;
      site: string;
      key: string;
    }[];
  };
  credits?: {
      cast: {
      id: number;
      name: string;
      profile_path: string | null;
    }[];
  };
}

const CINEMA_EXHIBITORS = [
  { name: "Movie", short: "MOV", color: "#FF6B35", linkKey: "link_movie" },
  { name: "Life Cinemas", short: "LIFE", color: "#e5361f", linkKey: "link_life_cinemas" },
  { name: "Grupo Cine", short: "GC", color: "#4f5ea7", linkKey: "link_grupo_cine" },
  { name: "Cines del Este", short: "ESTE", color: "#2ba137", linkKey: "link_cines_del_este" },
];

export function MovieDetailModal({ movie, isOpen, onClose, themeColor, movies, currentIndex = 0, onNavigate }: MovieDetailModalProps) {
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const { setTheme } = useTheme();

  const handlePrev = () => {
    if (!movies || !onNavigate) return;
    const prevIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    onNavigate(movies[prevIndex], prevIndex);
  };
  const handleNext = () => {
    if (!movies || !onNavigate) return;
    const nextIndex = currentIndex === movies.length - 1 ? 0 : currentIndex + 1;
    onNavigate(movies[nextIndex], nextIndex);
  };

  useEffect(() => {
    if (movie && isOpen && themeColor) {
      setTheme({
        primary: themeColor,
        secondary: "#000000",
        text: String(movie.id).length % 2 === 0 ? "#000000" : "#ffffff",
      });
    }
  }, [movie, isOpen, themeColor, setTheme]);

  useEffect(() => {
    if (movie && isOpen) {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await fetchMovieDetails(movie.id);
          setDetails(data as unknown as TMDBMovieDetails);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      setDetails(null);
      setShowTrailer(false);
    }
  }, [movie, isOpen]);

  if (!movie) return null;

  const trailer = details?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-[95vw] lg:max-w-6xl border-white/5 bg-zinc-950 p-0 text-white overflow-y-auto lg:overflow-visible max-h-[92vh] shadow-[0_0_100px_rgba(0,0,0,1)]">

        {/* Side navigation arrows — positioned outside the modal box on desktop */}
        {movies && onNavigate && (
          <>
            <button
              onClick={handlePrev}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%+20px)] z-[60] items-center justify-center rounded-full bg-black/70 border border-white/15 p-4 backdrop-blur-xl text-white transition-all duration-300 hover:bg-theme-primary hover:border-theme-primary hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
            <button
              onClick={handleNext}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%+20px)] z-[60] items-center justify-center rounded-full bg-black/70 border border-white/15 p-4 backdrop-blur-xl text-white transition-all duration-300 hover:bg-theme-primary hover:border-theme-primary hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          </>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[60] rounded-full bg-white/5 p-2 backdrop-blur-3xl transition-all hover:bg-theme-primary hover:text-white active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col lg:flex-row h-full min-h-0">
          
          {/* LEFT PANEL: Narrative & Media (62%) */}
          <div className="flex-1 lg:w-[62%] p-8 lg:p-14 overflow-y-auto border-r border-white/5 scrollbar-hide">
            <div className="space-y-10">
              
              {/* Top: Compact Title */}
              <div className="space-y-2">
                 <DialogTitle className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-theme-primary transition-colors duration-500">
                  {movie.original_title}
                 </DialogTitle>
              </div>

              {/* Middle: Professional Trailer Preview (Compact) */}
              <div className="relative aspect-video w-full max-w-xl rounded-sm overflow-hidden bg-black shadow-3xl border border-white/5">
                {loading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white/10" />
                  </div>
                ) : showTrailer && trailer ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative h-full w-full group cursor-pointer" onClick={() => setShowTrailer(true)}>
                    <Image
                      src={getImageUrl(movie.backdrop_path, "original")}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 1024px) 90vw, 560px"
                      className="object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="rounded-full bg-theme-primary px-8 py-4 text-white font-black tracking-widest uppercase flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 text-[10px]">
                          <Play className="h-3 w-3 fill-white" /> REPRODUCIR TRÁILER
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Compact Synopsis */}
              <div className="space-y-4 max-w-2xl">
                 <h4 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">SINOPSIS</h4>
                 <DialogDescription className="text-sm md:text-base font-light leading-relaxed text-white/50">
                  {movie.overview}
                 </DialogDescription>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL: Metadata & Cast (38%) */}
          <div className="lg:w-[38%] bg-white/[0.01] p-8 lg:p-12 lg:overflow-y-auto border-t lg:border-t-0 border-white/5">
            <div className="space-y-12">
              
              {/* Metadata Grid (Compact) */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">ESTRENO</p>
                   <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                      <Calendar className="h-4 w-4 text-theme-primary" />
                      {movie.release_date.split("-")[0]}
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">RATING</p>
                   <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                      <Star className="h-4 w-4 fill-theme-primary text-theme-primary" />
                      {movie.vote_average.toFixed(1)}
                   </div>
                </div>
              </div>

              {/* Cast List - ONLY TOP 4 (Photos Layout) */}
              {details?.credits?.cast && (
                <div className="space-y-6">
                  <h4 className="flex items-center gap-4 text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
                    <Users className="h-4 w-4 text-theme-primary" />
                    ELENCO PRINCIPAL
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                     {details.credits.cast.slice(0, 4).map((person) => (
                       <div key={person.id} className="group relative flex flex-col items-center gap-3">
                          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/10 transition-all group-hover:border-theme-primary group-hover:scale-105">
                             {person.profile_path ? (
                               <Image
                                 src={getImageUrl(person.profile_path, "w500")}
                                 alt={person.name}
                                 fill
                                 sizes="96px"
                                 className="object-cover grayscale transition-all group-hover:grayscale-0"
                               />
                             ) : (
                               <div className="flex h-full w-full items-center justify-center bg-white/5 text-[10px] font-black text-white/20">
                                 {person.name.charAt(0)}
                               </div>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}

              {/* RBS Distribution & Tickets */}
              <div className="space-y-8 pt-6 border-t border-white/5">
                 <div className="space-y-3">
                    <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">DISTRIBUCIÓN</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-xl font-black tracking-tighter uppercase">RBS</span>
                       <span className="text-[8px] font-bold tracking-[0.6em] uppercase opacity-20">Uruguay</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">DISPONIBLE EN</p>
                    <div className="grid grid-cols-2 gap-2">
                      {CINEMA_EXHIBITORS.map((cinema) => {
                        const link = movie._supabase?.[cinema.linkKey as keyof typeof movie._supabase] as string | null | undefined;
                        return link ? (
                          <a
                            key={cinema.name}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 px-3 py-2.5 rounded-sm border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/[0.02] hover:bg-white/5"
                          >
                            <div
                              className="h-6 w-6 rounded-sm flex items-center justify-center text-white text-[7px] font-black tracking-tight flex-shrink-0"
                              style={{ backgroundColor: cinema.color }}
                            >
                              {cinema.short.slice(0, 2)}
                            </div>
                            <span className="text-[8px] font-black tracking-[0.15em] uppercase text-white/50 group-hover:text-white transition-colors truncate">
                              {cinema.name}
                            </span>
                          </a>
                        ) : (
                          <div
                            key={cinema.name}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-sm border border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed"
                          >
                            <div
                              className="h-6 w-6 rounded-sm flex items-center justify-center text-white text-[7px] font-black tracking-tight flex-shrink-0 grayscale"
                              style={{ backgroundColor: cinema.color }}
                            >
                              {cinema.short.slice(0, 2)}
                            </div>
                            <span className="text-[8px] font-black tracking-[0.15em] uppercase text-white/30 truncate">
                              {cinema.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                 </div>

                 <button className="w-full relative group overflow-hidden px-6 py-4 rounded-full bg-white text-black text-[9px] font-black tracking-[0.4em] uppercase transition-all hover:bg-theme-primary hover:text-white active:scale-95 shadow-xl">
                    RESERVAR TICKETS
                 </button>

                 <p className="text-center text-[7px] font-black tracking-[1em] text-white/10 uppercase pt-4">
                    CINEMA EXPERIENCE
                 </p>
              </div>

            </div>
          </div>

        </div>

        {/* Mobile navigation bar — visible only on small screens */}
        {movies && onNavigate && (
          <div className="flex lg:hidden items-center justify-between px-6 py-4 border-t border-white/10 bg-black/80 backdrop-blur-xl">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              ANTERIOR
            </button>
            <span className="text-[10px] font-black tracking-[0.2em] text-white/20">
              {(currentIndex ?? 0) + 1} / {movies.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              SIGUIENTE
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
