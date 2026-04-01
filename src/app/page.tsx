import { Hero } from "@/components/Hero";
import { MovieGrid } from "@/components/MovieGrid";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { ContactSection } from "@/components/ContactSection";
import { fetchNowPlayingMoviesServer } from "@/lib/movies-server";

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RBS Entertainment",
  url: "https://rbsentertainment.com.uy",
  logo: "https://rbsentertainment.com.uy/assets/Logos/RBS logo color.png",
  description: "Distribuidora y licenciataria de contenido cinematográfico en Uruguay. Representantes de Disney, Universal Studios y Paramount Pictures.",
  address: { "@type": "PostalAddress", addressCountry: "UY" },
  sameAs: [
    "https://www.facebook.com/CINELOVERS",
    "https://www.instagram.com/cinelovers_uy/",
    "https://twitter.com/CINELOVERS_UY",
    "https://www.youtube.com/channel/UCQsZLbwhsg2pK_73yI_VjRA",
  ],
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

export default async function Home() {
  // Pre-fetch hero movies server-side so the LCP backdrop image renders on first paint
  const nowPlaying = await fetchNowPlayingMoviesServer();
  const heroMovies = nowPlaying.slice(0, 6);

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
      <Hero initialMovies={heroMovies} />
      <MovieGrid />

      <PartnerMarquee />

      <ContactSection />

      <Footer />
    </main>
  );
}
