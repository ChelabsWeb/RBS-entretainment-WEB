import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-pulse">
          <Image
            src="/assets/Logos/RBS logo blanco footer.png"
            alt="RBS Entertainment"
            width={120}
            height={48}
            priority
            className="object-contain"
          />
        </div>
        <span className="text-xs tracking-widest text-neutral-500 uppercase">
          Cargando
        </span>
      </div>
    </div>
  );
}
