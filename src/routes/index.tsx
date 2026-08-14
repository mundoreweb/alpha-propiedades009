import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSearch } from "@/components/HeroSearch";
import { FeaturedProperties } from "@/components/FeaturedProperties";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alpha Propiedades 009 — Bienes raíces en Costa Rica" },
      { name: "description", content: "Encuentra casas, apartamentos y villas en venta o alquiler en Costa Rica. Propiedades exclusivas en Guanacaste, San José, Heredia y más." },
      { property: "og:title", content: "Alpha Propiedades 009 — Bienes raíces en Costa Rica" },
      { property: "og:description", content: "Propiedades exclusivas en venta y alquiler en Costa Rica." },
    ],
    links: [
      { rel: "icon", type: "image/jpeg", href: "/favicon.jpg" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSearch />
        <FeaturedProperties />
      </main>
      <Footer />
    </div>
  );
}
