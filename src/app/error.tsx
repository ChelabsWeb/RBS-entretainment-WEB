'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[RBS Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <div className="mb-6 text-6xl font-thin tracking-widest text-amber-400/80">
        !
      </div>

      <h1 className="mb-3 text-2xl font-semibold tracking-wide text-white">
        Algo salió mal
      </h1>

      <p className="mb-8 max-w-md text-sm leading-relaxed text-neutral-400">
        Ocurrió un error inesperado. Por favor, intentá de nuevo o volvé más
        tarde.
      </p>

      <button
        onClick={reset}
        className="rounded-full border border-amber-400/40 px-8 py-2.5 text-sm font-medium tracking-wide text-amber-400 transition-colors hover:border-amber-400 hover:bg-amber-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
      >
        Reintentar
      </button>
    </div>
  );
}
