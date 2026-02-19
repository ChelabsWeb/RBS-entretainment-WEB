"use client";

import { useEffect, useState, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCarousel } from "@/components/MovieCarousel";
import { Movie, searchMovie, searchLicensedMovies } from "@/lib/tmdb";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { Hero } from "@/components/Hero";
import { Loader2, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";

const EN_CARTEL_TITLES = [
  "Avatar: Fuego y Cenizas",
  "Five Nights at Freddy's 2",
  "Zootopia 2",
  "Verdad y Traición",
  "Stray Kids: The dominATE Experience",
  "Hamnet",
  "Ayuda!",
  "Familia en Renta",
  "Bob Esponja: En busca de los pantalones cuadrados"
];

const PROXIMOS_ESTRENOS_TITLES = [
  "No te olvidaré",
  "Scream 7",
  "Está Funcionando Esto?",
  "El Diablo Se Viste a la Moda 2",
  "Michael",
  "David",
  "Boda Sangrienta 2",
  "Playa de Lobos",
  "Super Mario Galaxy: La Película",
  "EPiC: Elvis Presley in Concert",
  "Hoppers: Operación Castor"
];

function PeliculasContent() {
  const [enCartel, setEnCartel] = useState<Movie[]>([]);
  const [proximos, setProximos] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        const fetchMoviesByTitle = async (titles: string[]) => {
          const results = await Promise.all(
            titles.map(async (title) => {
              const movies = await searchMovie(title);
              return movies[0]; // Take the first result
            })
          );
          return results.filter(Boolean) as Movie[];
        };

        if (searchQuery) {
          const results = await searchLicensedMovies(searchQuery);
          setSearchResults(results || []);
          // Clear other carousels when search is active
          setEnCartel([]);
          setProximos([]);
        } else {
          setSearchResults([]);
          const [enCartelData, proximosData] = await Promise.all([
            fetchMoviesByTitle(EN_CARTEL_TITLES),
            fetchMoviesByTitle(PROXIMOS_ESTRENOS_TITLES)
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
          predefinedTitles={[
            "No te olvidaré",
            "Scream 7",
            "El Diablo Se Viste a la Moda 2",
            "Michael",
            "Boda Sangrienta 2",
            "Super Mario Galaxy: La Película"
          ]}
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
