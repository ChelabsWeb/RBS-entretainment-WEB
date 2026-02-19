import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-theme-primary selection:text-black">
      <Navbar />
      <div className="pt-20">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
