import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Film, Star } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Movie {
  id: string;
  titulo: string;
  sinopsis: string | null;
  poster_url: string | null;
  fecha_estreno: string | null;
  calificacion: string | null;
  formato_version: string | null;
  duracion_minutos: number | null;
  genero: string | null;
}

function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return "TBC";
  try {
    return format(parseISO(dateStr), "d MMM yyyy", { locale: es });
  } catch {
    return dateStr;
  }
}

function isUpcoming(dateStr: string | null): boolean {
  if (!dateStr) return true;
  try {
    return !isPast(parseISO(dateStr));
  } catch {
    return false;
  }
}

function MovieCard({ movie }: { movie: Movie }) {
  const upcoming = isUpcoming(movie.fecha_estreno);
  const posterUrl = movie.poster_url
    ? movie.poster_url.startsWith("http")
      ? movie.poster_url
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/movie-posters/${movie.poster_url}`
    : null;

  return (
    <Link href={`/vip/movies/${movie.id}`} className="block group">
      <article className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Poster */}
          <div className="relative w-full sm:w-48 md:w-56 aspect-[2/3] sm:aspect-auto sm:h-auto flex-shrink-0">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={movie.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 224px"
              />
            ) : (
              <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                <Film className="h-10 w-10 text-white/10" />
              </div>
            )}
            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`text-[9px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm ${
                  upcoming
                    ? "bg-[#4f5ea7] text-white"
                    : "bg-white/10 text-white/60 backdrop-blur-sm"
                }`}
              >
                {upcoming ? "Pr\u00f3ximo estreno" : "En cartel"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase leading-tight group-hover:text-[#4f5ea7] transition-colors">
                {movie.titulo}
              </h2>
              {movie.sinopsis && (
                <p className="mt-2 text-[13px] text-white/50 leading-relaxed line-clamp-3">
                  {movie.sinopsis}
                </p>
              )}
            </div>

            {/* Exhibition data row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-white/30" />
                <span className="text-[10px] tracking-widest uppercase text-white/40">
                  Estreno
                </span>
                <span className="text-[11px] font-bold text-white/80">
                  {formatShortDate(movie.fecha_estreno)}
                </span>
              </div>

              {movie.calificacion && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 text-white/30" />
                  <span className="text-[10px] tracking-widest uppercase text-white/40">
                    Calif.
                  </span>
                  <span className="text-[11px] font-bold text-white/80">
                    {movie.calificacion}
                  </span>
                </div>
              )}

              {movie.formato_version && (
                <div className="flex items-center gap-1.5">
                  <Film className="h-3 w-3 text-white/30" />
                  <span className="text-[10px] tracking-widest uppercase text-white/40">
                    Formato
                  </span>
                  <span className="text-[11px] font-bold text-white/80">
                    {movie.formato_version}
                  </span>
                </div>
              )}

              {movie.duracion_minutos && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-white/30" />
                  <span className="text-[10px] tracking-widest uppercase text-white/40">
                    Duraci\u00f3n
                  </span>
                  <span className="text-[11px] font-bold text-white/80">
                    {movie.duracion_minutos} min
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border border-white/10 bg-white/[0.02] rounded-sm overflow-hidden animate-pulse"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 md:w-56 aspect-[2/3] sm:aspect-auto sm:h-72 bg-white/5 flex-shrink-0" />
            <div className="flex-1 p-5 sm:p-6 space-y-4">
              <div className="h-5 bg-white/5 rounded w-2/3" />
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-4/5" />
              </div>
              <div className="flex gap-4 mt-4">
                <div className="h-3 bg-white/5 rounded w-24" />
                <div className="h-3 bg-white/5 rounded w-16" />
                <div className="h-3 bg-white/5 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function MovieFeed() {
  const supabase = await createClient();

  // Fetch published movies ordered by release date DESC
  const { data: movies, error } = await supabase
    .from("movies")
    .select(
      "id, titulo, sinopsis, poster_url, fecha_estreno, calificacion, formato_version, duracion_minutos, genero"
    )
    .in("estado_publicacion", ["vip", "publicado"])
    .order("fecha_estreno", { ascending: false, nullsFirst: true });

  if (error) {
    console.error("Error fetching movies:", error);
    return (
      <div className="text-center py-20">
        <p className="text-white/40 text-sm">Error al cargar pel\u00edculas.</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-20">
        <Film className="h-12 w-12 text-white/10 mx-auto mb-4" />
        <p className="text-white/40 text-sm">No hay pel\u00edculas publicadas a\u00fan.</p>
      </div>
    );
  }

  const typedMovies = movies as Movie[];

  // Split into upcoming and current
  const upcoming = typedMovies.filter((m: Movie) => isUpcoming(m.fecha_estreno));
  const current = typedMovies.filter((m: Movie) => !isUpcoming(m.fecha_estreno));

  return (
    <div className="space-y-10">
      {/* Upcoming section */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-[11px] font-black tracking-[0.25em] uppercase text-[#4f5ea7]">
              Pr\u00f3ximos Estrenos
            </h2>
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/30 font-bold">
              {upcoming.length}
            </span>
          </div>
          <div className="space-y-4">
            {upcoming.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Current section */}
      {current.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-[11px] font-black tracking-[0.25em] uppercase text-white/50">
              En Cartel
            </h2>
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/30 font-bold">
              {current.length}
            </span>
          </div>
          <div className="space-y-4">
            {current.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function VipPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">
          Cat\u00e1logo
        </h1>
        <p className="mt-1 text-[12px] text-white/40 tracking-wide">
          Informaci\u00f3n de exhibici\u00f3n actualizada para nuestros socios
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <MovieFeed />
      </Suspense>
    </div>
  );
}
