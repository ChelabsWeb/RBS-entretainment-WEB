import { createClient } from "@/lib/supabase/client";

// Distributor → local logo path mapping
export const DISTRIBUTOR_LOGOS: Record<string, string> = {
  disney: "/assets/licencias/disney/disney logo.png",
  dreamworks: "/assets/Logos/dreamworks-animation-logo-black-and-white.png",
  illumination: "/assets/Logos/illumination logo.png",
  patagonik: "/assets/Logos/Patagonik_Film_Group_Logo.webp",
  lucasfilm: "/assets/Logos/lucasfilm-logo-black-and-white.png",
  nickelodeon: "/assets/Logos/Nickelodeon_Splat_2023_Sin_Fondo.webp",
  paramount: "/assets/Logos/Paramount_Pictures_Corporation_logo.png",
  marvel: "/assets/Logos/marvel-logo.png",
};

export const DISTRIBUTOR_LABELS: Record<string, string> = {
  disney: "Disney",
  dreamworks: "DreamWorks",
  illumination: "Illumination",
  patagonik: "Patagonik",
  lucasfilm: "Lucasfilm",
  nickelodeon: "Nickelodeon",
  paramount: "Paramount Pictures",
  marvel: "Marvel Studios",
};

// Supabase movie type (from our database)
export interface SupabaseMovie {
  id: string;
  titulo: string;
  sinopsis: string | null;
  poster_url: string | null;
  distributor: string | null;
  estado_publicacion: "borrador" | "vip" | "publicado" | "archivado";
  fecha_anuncio_preventa: string | null;
  fecha_preventa: string | null;
  fecha_pre_estreno: string | null;
  hora_pre_estreno: string | null;
  fecha_estreno: string | null;
  calificacion: string | null;
  formato_version: string | null;
  duracion_minutos: number | null;
  genero: string | null;
  anio: number | null;
  director: string | null;
  elenco: string | null;
  link_movie: string | null;
  link_life_cinemas: string | null;
  link_grupo_cine: string | null;
  link_cines_del_este: string | null;
  trailer_url: string | null;
  hero_image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Compatible interface with the existing Movie type used by landing page components
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  distributor_logo?: string;
  // Extended fields from Supabase
  _supabase?: SupabaseMovie;
}

// Convert Supabase movie to the legacy Movie interface for landing page compatibility
function toMovie(m: SupabaseMovie): Movie {
  return {
    id: m.id as unknown as number, // UUID cast for legacy compatibility
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

// Get image URL - handles both TMDB paths and Supabase Storage URLs
export function getImageUrl(path: string, _size?: string): string {
  if (!path) return "/placeholder-movie.svg";
  // If it's already a full URL (Supabase Storage), return as-is
  if (path.startsWith("http")) return path;
  // Legacy TMDB path
  return `https://image.tmdb.org/t/p/${_size || "w500"}${path}`;
}

// Fetch published movies currently in theaters (fecha_estreno <= now)
export async function fetchNowPlayingMovies(): Promise<Movie[]> {
  const supabase = createClient();
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

// Fetch published upcoming movies (fecha_estreno > now)
export async function fetchUpcomingMovies(): Promise<Movie[]> {
  const supabase = createClient();
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

// Search published movies by title
export async function searchMovie(query: string): Promise<Movie[]> {
  const supabase = createClient();

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

// Alias for search (replaces TMDB's licensed search)
export async function searchLicensedMovies(query: string): Promise<Movie[]> {
  return searchMovie(query);
}

// Fetch a single movie's details
export async function fetchMovieDetails(movieId: number | string): Promise<Record<string, unknown>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", String(movieId))
    .single();

  if (error || !data) return {};
  return data as unknown as Record<string, unknown>;
}

// Extract YouTube video ID from a URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch trailer from the movie's trailer_url field
export async function fetchMovieTrailers(movieId: number | string): Promise<{ type: string; site: string; key: string }[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("movies")
    .select("trailer_url")
    .eq("id", String(movieId))
    .single();

  if (!data?.trailer_url) return [];

  const youtubeId = extractYouTubeId(data.trailer_url);
  if (!youtubeId) return [];

  return [{ type: "Trailer", site: "YouTube", key: youtubeId }];
}

// Stub: credits not available in Supabase yet
export async function fetchMovieCredits(_movieId: number | string): Promise<Record<string, unknown>> {
  return { cast: [], crew: [] };
}
