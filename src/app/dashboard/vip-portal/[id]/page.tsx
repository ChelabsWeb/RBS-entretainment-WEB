import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Download, Film, FileText, Star, Tag, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { fetchPeoplePhotos } from "@/lib/tmdb-people";

interface Movie {
  id: string;
  titulo: string;
  sinopsis: string | null;
  poster_url: string | null;
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
}

interface MovieDocument {
  id: string;
  movie_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  uploaded_at: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Por confirmar";
  try {
    return format(parseISO(dateStr), "d 'de' MMMM, yyyy", { locale: es });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "";
  return timeStr;
}

function DataItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-3 sm:p-4 border border-white/10 bg-white/[0.02] rounded-sm">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-white/30" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-bold">
          {label}
        </span>
      </div>
      <span className="text-[13px] sm:text-sm font-bold text-white/90">
        {value}
      </span>
    </div>
  );
}

export default async function DashboardMovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: movie, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !movie) {
    notFound();
  }

  const typedMovie = movie as Movie;

  const { data: documents } = await supabase
    .from("movie_documents")
    .select("*")
    .eq("movie_id", id)
    .order("uploaded_at", { ascending: false });

  const typedDocuments = (documents ?? []) as MovieDocument[];

  // Fetch cast + director photos
  const peopleNames: string[] = [];
  if (typedMovie.director) peopleNames.push(typedMovie.director);
  if (typedMovie.elenco) {
    peopleNames.push(...typedMovie.elenco.split(",").map((n) => n.trim()).filter(Boolean));
  }
  const peopleWithPhotos = peopleNames.length > 0 ? await fetchPeoplePhotos(peopleNames) : [];

  const posterUrl = typedMovie.poster_url
    ? typedMovie.poster_url.startsWith("http")
      ? typedMovie.poster_url
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/movie-posters/${typedMovie.poster_url}`
    : null;

  return (
    <div>
      <Link
        href="/dashboard/vip-portal"
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al Portal VIP
      </Link>

      {/* Movie header */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10">
        {posterUrl && (
          <div className="relative w-full sm:w-56 md:w-64 aspect-[2/3] rounded-sm overflow-hidden border border-white/10 flex-shrink-0">
            <Image
              src={posterUrl}
              alt={typedMovie.titulo}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              quality={100}
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-tight">
            {typedMovie.titulo}
          </h1>

          <div className="flex flex-wrap gap-2 mt-3">
            {typedMovie.genero && (
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 border border-white/10 px-2 py-0.5 rounded-sm">
                {typedMovie.genero}
              </span>
            )}
            {typedMovie.anio && (
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 border border-white/10 px-2 py-0.5 rounded-sm">
                {typedMovie.anio}
              </span>
            )}
            {typedMovie.director && (
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 border border-white/10 px-2 py-0.5 rounded-sm">
                Dir. {typedMovie.director}
              </span>
            )}
          </div>

          {typedMovie.sinopsis && (
            <div className="mt-5">
              <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-white/40 mb-2">
                Sinopsis
              </h3>
              <p className="text-[13px] sm:text-sm text-white/60 leading-relaxed whitespace-pre-line">
                {typedMovie.sinopsis}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Exhibition Data */}
      <section className="mb-10">
        <h3 className="text-[11px] font-black tracking-[0.25em] uppercase text-[#4f5ea7] mb-4">
          Datos de Exhibición
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          <DataItem label="Anuncio de Preventa" value={formatDate(typedMovie.fecha_anuncio_preventa)} icon={Calendar} />
          <DataItem label="Preventa" value={formatDate(typedMovie.fecha_preventa)} icon={Calendar} />
          <DataItem label="Pre-estreno" value={formatDate(typedMovie.fecha_pre_estreno) + (typedMovie.hora_pre_estreno ? ` - ${formatTime(typedMovie.hora_pre_estreno)}` : "")} icon={Calendar} />
          <DataItem label="Estreno" value={formatDate(typedMovie.fecha_estreno)} icon={Calendar} />
          <DataItem label="Calificación" value={typedMovie.calificacion ?? "Por confirmar"} icon={Star} />
          <DataItem label="Formato y Versión" value={typedMovie.formato_version ?? "Por confirmar"} icon={Film} />
          <DataItem label="Duración" value={typedMovie.duracion_minutos ? `${typedMovie.duracion_minutos} min` : "Por confirmar"} icon={Clock} />
          {typedMovie.genero && <DataItem label="Género" value={typedMovie.genero} icon={Tag} />}
        </div>
      </section>

      {/* Cast & Director */}
      {peopleWithPhotos.length > 0 && (
        <section className="mb-10">
          <h3 className="text-[11px] font-black tracking-[0.25em] uppercase text-[#4f5ea7] mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Elenco y Dirección
          </h3>
          <div className="flex flex-wrap gap-4">
            {peopleWithPhotos.map((person, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-20">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                  {person.photo_url ? (
                    <Image src={person.photo_url} alt={person.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-lg font-bold">
                      {person.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-white/50 text-center leading-tight font-medium">
                  {person.name}
                </span>
                {i === 0 && typedMovie.director && person.name === typedMovie.director && (
                  <span className="text-[8px] text-[#4f5ea7] uppercase tracking-wider font-bold -mt-1">
                    {person.gender === 1 ? "Directora" : "Director"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documents */}
      {typedDocuments.length > 0 && (
        <section className="mb-10">
          <h3 className="text-[11px] font-black tracking-[0.25em] uppercase text-[#4f5ea7] mb-4">
            Documentos
          </h3>
          <div className="space-y-2">
            {typedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 border border-white/10 bg-white/[0.02] rounded-sm">
                <FileText className="h-4 w-4 text-white/30 flex-shrink-0" />
                <span className="text-[13px] text-white/70 flex-1 truncate">{doc.file_name}</span>
                <Download className="h-4 w-4 text-white/30" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
