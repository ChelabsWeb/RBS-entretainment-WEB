"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Loader2, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { fetchTrendingMovies, getImageUrl, Movie, searchMovie, fetchMovieTrailers } from "@/lib/tmdb";
import { MovieDetailModal } from "./MovieDetailModal";
import Image from "next/image";

export function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    async function loadHeroMovies() {
      try {
        const trending = await fetchTrendingMovies();
        const martyResults = await searchMovie("Marty Supreme");
        
        let curated = trending.slice(0, 6);
        
        if (martyResults.length > 0) {
          const marty = martyResults[0];
          // Remove marty if already in trending to avoid duplicates
          curated = curated.filter(m => m.id !== marty.id);
          // Insert Marty at index 3 (Orange slot)
          curated.splice(3, 0, marty);
          // Keep only 6
          curated = curated.slice(0, 6);
        }
        
        setMovies(curated);
      } catch (error) {
        console.error("Failed to fetch trending movies:", error);
      } finally {
        setLoading(false);
      }
    }
    loadHeroMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const colors = [
        "#4f5ea7", // Blue
        "#cb3088", // Pink
        "#e5361f", // Red
        "#ec7312", // Orange
        "#fcbf2d", // Yellow
        "#2ba137"  // Green
      ];
      const themeColor = colors[currentSlide % colors.length];
      
      const timer = setTimeout(() => {
        if (!selectedMovie) {
          setTheme({
            primary: themeColor,
            secondary: "#000000",
            text: currentSlide % 2 === 0 ? "#000000" : "#ffffff",
          });
        }
      }, 400); // Wait for the transition to be partially visible before changing theme colors
      
      return () => clearTimeout(timer);
    }
  }, [currentSlide, movies, setTheme]);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies, currentSlide]); // Include currentSlide to reset interval on manual navigation

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const [fullScreenTrailer, setFullScreenTrailer] = useState<string | null>(null);

  const handlePlayTrailer = async () => {
    try {
      const trailers = await fetchMovieTrailers(currentMovie.id);
      if (trailers.length > 0) {
        setFullScreenTrailer(trailers[0].key);
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
  };

  if (loading) {
    return (
      <section className="relative h-[100vh] w-full bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin opacity-20" />
      </section>
    );
  }

  const currentMovie = movies[currentSlide];

  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={getImageUrl(currentMovie.backdrop_path, "original")}
              alt={currentMovie.title}
              fill
              className="object-cover opacity-60 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center text-white">
            <div className="w-full max-w-6xl flex flex-col items-center text-center">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl font-black uppercase tracking-tighter md:text-[10vw] leading-[0.8] text-theme-primary transition-colors duration-1000 text-center mx-auto"
              >
                {currentMovie.original_title}
              </motion.h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-8 h-1 w-24 bg-theme-primary transition-colors duration-1000 mx-auto"
              />
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-8 max-w-2xl text-sm font-light tracking-[0.2em] uppercase text-white/50 md:text-base text-center mx-auto"
              >
                {currentMovie.overview.length > 150 
                  ? `${currentMovie.overview.substring(0, 150)}...` 
                  : currentMovie.overview}
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-12 flex justify-center"
              >
                <button 
                  onClick={() => setSelectedMovie(currentMovie)}
                  className="rounded-full border-2 border-theme-primary bg-transparent px-14 py-4 font-black tracking-[0.4em] text-theme-primary transition-all duration-500 hover:bg-theme-primary hover:text-white uppercase text-[10px]"
                >
                  DETALLES
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 right-12 z-20 hidden items-center gap-4 md:flex">
        <button
          onClick={prevSlide}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-theme-primary bg-transparent text-theme-primary transition-all duration-500 hover:scale-110 hover:bg-theme-primary hover:text-white active:scale-95"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-theme-primary bg-transparent text-theme-primary transition-all duration-500 hover:scale-110 hover:bg-theme-primary hover:text-white active:scale-95"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-500 ${
              i === currentSlide
                ? "h-2 w-16 bg-theme-primary rounded-full shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.5)]"
                : "h-2 w-2 bg-white/20 rounded-full hover:bg-theme-primary/40"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 left-12 z-20">
        <button
          onClick={handlePlayTrailer}
          className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-theme-primary bg-transparent text-theme-primary shadow-2xl transition-all duration-500 hover:scale-110 hover:bg-theme-primary hover:text-white active:scale-95"
        >
          <Play className="h-6 w-6 fill-current" />
        </button>
      </div>

      <motion.div 
        animate={{ color: "#ffffff" }}
        className="absolute top-32 left-12 z-20 hidden md:block"
      >
        <p className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 [writing-mode:vertical-lr] rotate-180">
          GLOBAL TRENDING
        </p>
      </motion.div>

      {/* Full Screen Trailer Overlay */}
      <AnimatePresence>
        {fullScreenTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >

            <iframe
              src={`https://www.youtube.com/embed/${fullScreenTrailer}?autoplay=1`}
              className="h-full w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setFullScreenTrailer(null)}
              className="absolute top-10 right-10 z-[110] rounded-full bg-white/10 p-4 backdrop-blur-xl transition-all hover:bg-white hover:text-black"
            >
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <MovieDetailModal 
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        themeColor={movies.length > 0 ? ["#4f5ea7", "#cb3088", "#e5361f", "#ec7312", "#fcbf2d", "#2ba137"][currentSlide % 6] : undefined}
      />
    </section>
  );
}
