import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PeliculasClient } from "@/components/PeliculasClient";
import {
  fetchNowPlayingMoviesServer,
  fetchUpcomingMoviesServer,
  searchMoviesServer,
} from "@/lib/movies-server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Películas - RBS Entertainment",
  description:
    "Descubrí las películas en cartel y los próximos estrenos en RBS Cinema. Cartelera actualizada con los mejores títulos del cine.",
};

export default async function PeliculasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: searchQuery } = await searchParams;

  let enCartel: Awaited<ReturnType<typeof fetchNowPlayingMoviesServer>> = [];
  let proximos: Awaited<ReturnType<typeof fetchUpcomingMoviesServer>> = [];
  let searchResults: Awaited<ReturnType<typeof searchMoviesServer>> = [];

  if (searchQuery) {
    searchResults = await searchMoviesServer(searchQuery);
  } else {
    [enCartel, proximos] = await Promise.all([
      fetchNowPlayingMoviesServer(),
      fetchUpcomingMoviesServer(),
    ]);
  }

  return (
    <PeliculasClient
      enCartel={enCartel}
      proximos={proximos}
      searchResults={searchResults}
      searchQuery={searchQuery ?? null}
    />
  );
}
