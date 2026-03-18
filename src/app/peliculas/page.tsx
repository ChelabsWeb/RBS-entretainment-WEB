"use client";

import { useEffect, useState, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCarousel } from "@/components/MovieCarousel";
import { Movie, searchLicensedMovies, fetchNowPlayingMovies, fetchUpcomingMovies } from "@/lib/movies";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { Hero } from "@/components/Hero";
import { Loader2, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLenis } from "lenis/react";
import clsx from "clsx";

function PeliculasContent() {
  const [enCartel, setEnCartel] = useState<Movie[]>([]);
  const [proximos, setProximos] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const lenis = useLenis();

  // Resize Lenis when dynamic content loads
  useEffect(() => {
    if (!loading && lenis) {
      lenis.resize();
    }
  }, [loading, lenis, enCartel, proximos, searchResults]);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        if (searchQuery) {
          const results = await searchLicensedMovies(searchQuery);
          setSearchResults(results || []);
          setEnCartel([]);
          setProximos([]);
        } else {
          setSearchResults([]);
          const [enCartelData, proximosData] = await Promise.all([
            fetchNowPlayingMovies(),
            fetchUpcomingMovies()
          ]);
          setEnCartel(enCartelData);
          setProximos(proximosData);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {!searchQuery && (
        <Hero
          heroTitle="PROXIMOS ESTRENOS"
          isLeftAligned={true}
          showDetails={false}
          headingClassName="md:text-[6vw]"
          customHeading={
            <span className="text-white">CINE</span>
          }
        />
      )}
      
      <div className={clsx(
        "container mx-auto px-6 space-y-24",
        searchQuery ? "pt-48 pb-24" : "py-24"
      )}>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-12 w-12 text-theme-primary animate-spin opacity-40" />
          </div>
        ) : searchQuery ? (
          <div className="space-y-16">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                BUSCANDO: <span className="text-theme-primary transition-colors duration-1000">{searchQuery}</span>
              </h2>
              <p className="text-xs font-bold tracking-[0.4em] text-white/20 uppercase">
                {searchResults.length} {searchResults.length === 1 ? 'RESULTADO ENCONTRADO' : 'RESULTADOS ENCONTRADOS'}
              </p>
            </div>
            
            {searchResults.length > 0 ? (
              <MovieCarousel 
                title="" 
                movies={searchResults} 
                onMovieClick={setSelectedMovie} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-white/5 space-y-6">
                <SearchX className="h-24 w-24" />
                <div className="text-center space-y-2">
                  <p className="text-xl font-black tracking-widest uppercase">SIN RESULTADOS</p>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase opacity-40">INTENTA CON OTROS TÉRMINOS O REVISA LA ORTOGRAFÍA</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-32">
            <MovieCarousel 
              title="EN CARTEL" 
              movies={enCartel} 
              onMovieClick={setSelectedMovie} 
            />
            <MovieCarousel 
              title="PRÓXIMOS ESTRENOS" 
              movies={proximos} 
              onMovieClick={setSelectedMovie} 
            />
          </div>
        )}
      </div>

      <Footer />

      <MovieDetailModal 
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </main>
  );
}

export default function PeliculasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-theme-primary animate-spin opacity-40" />
      </div>
    }>
      <PeliculasContent />
    </Suspense>
  );
}
