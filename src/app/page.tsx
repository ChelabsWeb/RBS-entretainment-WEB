import { Hero } from "@/components/Hero";
import { MovieGrid } from "@/components/MovieGrid";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <MovieGrid />

      <PartnerMarquee />

      <ContactSection />

      <Footer />
    </main>
  );
}
