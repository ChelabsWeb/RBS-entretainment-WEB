import MovieForm from "@/components/dashboard/MovieForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewMoviePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard/movies"
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Películas
      </Link>
      <MovieForm mode="create" />
    </div>
  );
}
