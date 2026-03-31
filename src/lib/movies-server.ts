import { createClient } from "@/lib/supabase/server";
import type { SupabaseMovie, Movie } from "@/lib/movies";
import { DISTRIBUTOR_LOGOS } from "@/lib/movies";

// Convert Supabase movie to the legacy Movie interface (server-side version)
function toMovie(m: SupabaseMovie): Movie {
  return {
    id: m.id as unknown as number,
    title: m.titulo,
    original_title: m.titulo,
    overview: m.sinopsis || "",
    poster_path: m.poster_url || "",
    backdrop_path: m.hero_image_url || m.poster_url || "",
    release_date: m.fecha_estreno ? m.fecha_estreno.split("T")[0] : "",
    vote_average: 0,
    distributor_logo: m.distributor ? DISTRIBUTOR_LOGOS[m.distributor] : undefined,
    _supabase: m,
  };
}

// Server-side: Fetch published movies currently in theaters (fecha_estreno <= now)
export async function fetchNowPlayingMoviesServer(): Promise<Movie[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("estado_publicacion", "publicado")
    .lte("fecha_estreno", now)
    .order("fecha_estreno", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data.map(toMovie);
}

// Server-side: Fetch published upcoming movies (fecha_estreno > now)
export async function fetchUpcomingMoviesServer(): Promise<Movie[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("estado_publicacion", "publicado")
    .gt("fecha_estreno", now)
    .order("fecha_estreno", { ascending: true })
    .limit(20);

  if (error || !data) return [];
  return data.map(toMovie);
}

// Server-side: Search published movies by title
export async function searchMoviesServer(query: string): Promise<Movie[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("estado_publicacion", "publicado")
    .ilike("titulo", `%${query}%`)
    .order("fecha_estreno", { ascending: false })
    .limit(10);

  if (error || !data) return [];
  return data.map(toMovie);
}
