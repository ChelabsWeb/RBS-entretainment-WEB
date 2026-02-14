"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCarousel } from "@/components/MovieCarousel";
import { Movie, searchMovie } from "@/lib/tmdb";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { Hero } from "@/components/Hero";
import { Loader2 } from "lucide-react";

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

export default function PeliculasPage() {
  const [enCartel, setEnCartel] = useState<Movie[]>([]);
  const [proximos, setProximos] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function loadMovies() {
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

        const [enCartelData, proximosData] = await Promise.all([
          fetchMoviesByTitle(EN_CARTEL_TITLES),
          fetchMoviesByTitle(PROXIMOS_ESTRENOS_TITLES)
        ]);

        setEnCartel(enCartelData);
        setProximos(proximosData);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero 
        heroTitle="CINE"
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
      
      <div className="container mx-auto px-6 py-24 space-y-24">

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-12 w-12 text-theme-primary animate-spin opacity-40" />
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
