export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-amber-400" />
        <span className="text-xs tracking-widest text-neutral-500 uppercase">
          Cargando
        </span>
      </div>
    </div>
  );
}
