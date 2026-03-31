import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { Film } from "lucide-react";
import { DISTRIBUTOR_LABELS } from "@/lib/movies";
import { VipMovieCarousel } from "@/components/VipMovieCarousel";

export const metadata: Metadata = {
  title: "Catálogo VIP",
  description:
    "Portal de exhibidores - Catálogo de películas con información de distribución actualizada para socios de RBS Entertainment.",
};

interface VipMovie {
  id: string;
  titulo: string;
  poster_url: string | null;
  distributor: string | null;
}

function resolvePosterUrl(raw: string | null): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/movie-posters/${raw}`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-3 w-32 bg-white/5 rounded" />
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="aspect-[2/3] min-w-[160px] sm:min-w-[180px] md:min-w-[220px] bg-white/5 rounded-sm flex-shrink-0"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

async function MovieFeed() {
  const supabase = await createClient();

  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, titulo, poster_url, distributor")
    .in("estado_publicacion", ["vip", "publicado"])
    .order("fecha_estreno", { ascending: false, nullsFirst: true });

  if (error) {
    console.error("Error fetching movies:", error);
    return (
      <div className="text-center py-20">
        <p className="text-white/40 text-sm">Error al cargar películas.</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-20">
        <Film className="h-12 w-12 text-white/10 mx-auto mb-4" />
        <p className="text-white/40 text-sm">No hay películas publicadas aún.</p>
      </div>
    );
  }

  // Group by distributor
  const grouped = new Map<string, VipMovie[]>();
  for (const movie of movies as VipMovie[]) {
    const key = movie.distributor?.trim() || "__otros__";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push({
      ...movie,
      poster_url: resolvePosterUrl(movie.poster_url),
    });
  }

  // Sort alphabetically, "Otros" last
  const sortedGroups = [...grouped.entries()].sort((a, b) => {
    if (a[0] === "__otros__") return 1;
    if (b[0] === "__otros__") return -1;
    const labelA = DISTRIBUTOR_LABELS[a[0]] || a[0];
    const labelB = DISTRIBUTOR_LABELS[b[0]] || b[0];
    return labelA.localeCompare(labelB);
  });

  return (
    <div className="space-y-10">
      {sortedGroups.map(([key, groupMovies]) => (
        <VipMovieCarousel
          key={key}
          title={key === "__otros__" ? "Otros" : (DISTRIBUTOR_LABELS[key] || key)}
          movies={groupMovies}
          count={groupMovies.length}
        />
      ))}
    </div>
  );
}

export default function VipPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">
          Catálogo
        </h1>
        <p className="mt-1 text-[12px] text-white/40 tracking-wide">
          Información de exhibición actualizada para nuestros socios
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <MovieFeed />
      </Suspense>
    </div>
  );
}
