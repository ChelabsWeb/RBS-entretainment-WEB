import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licencias",
  description:
    "RBS Entertainment es representante de The Walt Disney Company y United International Pictures en Uruguay. Consultas sobre licenciamiento de títulos cinematográficos.",
};

export default function LicensingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
