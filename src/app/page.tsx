import { Hero } from "@/components/Hero";
import { MovieGrid } from "@/components/MovieGrid";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <MovieGrid />
      
      {/* RBS Identity Section */}
      <section className="bg-zinc-950 py-32 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              LIDERANDO EL <br />
              <span className="italic font-light text-theme-primary transition-colors duration-1000">ENTRETENIMIENTO</span> <br />
              EN URUGUAY
            </h2>
            <p className="text-xl font-light text-white/40 leading-relaxed">
              Desde 1997, RBS Entertainment ha sido el puente entre los estudios 
              más grandes del mundo y el público uruguayo. Nuestra pasión por el 
              cine define cada uno de nuestros pasos.
            </p>

          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-white/5 rounded-sm border border-white/10 flex items-center justify-center p-8 text-center group hover:bg-white/10 transition-colors">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">WALT DISNEY</p>
            </div>
            <div className="aspect-square bg-white/5 rounded-sm border border-white/10 flex items-center justify-center p-8 text-center group hover:bg-white/10 transition-colors">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">UNIVERSAL</p>
            </div>
            <div className="aspect-square bg-white/5 rounded-sm border border-white/10 flex items-center justify-center p-8 text-center group hover:bg-white/10 transition-colors">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">PARAMOUNT</p>
            </div>
            <div className="aspect-square bg-white/5 rounded-sm border border-white/10 flex items-center justify-center p-8 text-center group hover:bg-white/10 transition-colors">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">UIP</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
