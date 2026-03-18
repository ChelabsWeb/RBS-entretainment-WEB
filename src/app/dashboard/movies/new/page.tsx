import MovieForm from "@/components/dashboard/MovieForm";

export default function NewMoviePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <MovieForm mode="create" />
    </div>
  );
}
