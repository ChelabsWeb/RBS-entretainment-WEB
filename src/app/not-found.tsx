import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="mb-2 text-8xl font-thin tracking-widest text-amber-400/80">
        404
      </h1>

      <h2 className="mb-3 text-xl font-semibold tracking-wide text-white">
        Página no encontrada
      </h2>

      <p className="mb-8 max-w-md text-sm leading-relaxed text-neutral-400">
        La página que buscás no existe o fue movida. Volvé al inicio para
        continuar navegando.
      </p>

      <Link
        href="/"
        className="rounded-full border border-amber-400/40 px-8 py-2.5 text-sm font-medium tracking-wide text-amber-400 transition-colors hover:border-amber-400 hover:bg-amber-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
