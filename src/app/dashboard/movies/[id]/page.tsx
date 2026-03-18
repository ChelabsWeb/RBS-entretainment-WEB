"use client";

import { useEffect, useState, use } from "react";
import { getMovie } from "@/lib/actions/movies";
import MovieForm from "@/components/dashboard/MovieForm";
import DocumentsSection from "@/components/dashboard/DocumentsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditMoviePageProps {
  params: Promise<{ id: string }>;
}

export default function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = use(params);
  const [movie, setMovie] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await getMovie(id);
        setMovie(data as Record<string, unknown>);
      } catch {
        setError("No se pudo cargar la pel\u00edcula.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/40">Cargando pel&iacute;cula...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-400">{error ?? "Pel\u00edcula no encontrada."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {movie.titulo as string}
      </h1>

      <Tabs defaultValue="datos" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger
            value="datos"
            className="data-[state=active]:bg-[#4f5ea7] data-[state=active]:text-white text-white/60"
          >
            Datos
          </TabsTrigger>
          <TabsTrigger
            value="documentos"
            className="data-[state=active]:bg-[#4f5ea7] data-[state=active]:text-white text-white/60"
          >
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="mt-6">
          <MovieForm movie={movie} mode="edit" />
        </TabsContent>

        <TabsContent value="documentos" className="mt-6">
          <DocumentsSection movieId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
