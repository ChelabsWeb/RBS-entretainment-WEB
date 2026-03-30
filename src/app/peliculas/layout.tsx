import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Películas",
  description:
    "Descubrí las películas en cartel y próximos estrenos en RBS Entertainment. Cartelera actualizada con los últimos lanzamientos de Disney, Universal y Paramount.",
};

export default function PeliculasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
