import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé la historia de RBS Entertainment, agencia especializada en distribución y licenciamiento cinematográfico en Uruguay desde 1997.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
