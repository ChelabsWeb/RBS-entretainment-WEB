"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchMovieDetails, getImageUrl, Movie } from "@/lib/tmdb";
import { Star, Calendar, Users, Loader2, Play, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
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

export function MovieDetailModal({ movie, isOpen, onClose, themeColor }: MovieDetailModalProps) {
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (movie && isOpen && themeColor) {
      setTheme({
        primary: themeColor,
        secondary: "#000000",
        text: movie.id % 2 === 0 ? "#000000" : "#ffffff", // Standard logic
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
      <DialogContent showCloseButton={false} className="max-w-[95vw] lg:max-w-6xl border-white/5 bg-zinc-950 p-0 text-white overflow-y-auto lg:overflow-hidden max-h-[92vh] shadow-[0_0_100px_rgba(0,0,0,1)]">
        
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
      </DialogContent>
    </Dialog>
  );
}
