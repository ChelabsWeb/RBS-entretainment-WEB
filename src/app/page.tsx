import { Hero } from "@/components/Hero";
import { MovieGrid } from "@/components/MovieGrid";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { ContactSection } from "@/components/ContactSection";

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RBS Entertainment",
  url: "https://rbsentertainment.com.uy",
  logo: "https://rbsentertainment.com.uy/assets/Logos/RBS logo color.png",
  description: "Distribuidora y licenciataria de contenido cinematográfico en Uruguay. Representantes de Disney, Universal Studios y Paramount Pictures.",
  address: { "@type": "PostalAddress", addressCountry: "UY" },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RBS Entertainment",
  url: "https://rbsentertainment.com.uy",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://rbsentertainment.com.uy/peliculas?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <Navbar />
      <Hero />
      <MovieGrid />

      <PartnerMarquee />

      <ContactSection />

      <Footer />
    </main>
  );
}
