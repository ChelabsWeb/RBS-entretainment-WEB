import { Hero } from "@/components/Hero";
import { MovieGrid } from "@/components/MovieGrid";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { ContactSection } from "@/components/ContactSection";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero 
        predefinedTitles={[
          "Avatar: Fuego y Cenizas",
          "Five Nights at Freddy's 2",
          "Zootopia 2",
          "Verdad y Traición",
          "Hamnet",
          "Familia en Renta"
        ]}
      />
      <MovieGrid 
        predefinedTitles={[
          "Robot Salvaje",
          "Moana 2",
          "Wicked"
        ]}
      />
      
      {/* RBS Identity Section replaced by marquee */}
      <PartnerMarquee />

      {/* Moved Contact section here */}
      <ContactSection />

      <Footer />
    </main>
  );
}
