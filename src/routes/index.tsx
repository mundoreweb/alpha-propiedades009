import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { HeroSearch } from "@/components/HeroSearch";
import { FeaturedProperties } from "@/components/FeaturedProperties";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alpha Propiedades — Bienes raíces en Costa Rica" },
      { name: "description", content: "Encuentra casas, apartamentos y villas en venta o alquiler en Costa Rica. Propiedades exclusivas en Guanacaste, San José, Heredia y más." },
      { property: "og:title", content: "Alpha Propiedades — Bienes raíces en Costa Rica" },
      { property: "og:description", content: "Propiedades exclusivas en venta y alquiler en Costa Rica." },
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
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Alpha Propiedades · San José, Costa Rica · Pura Vida 🌿
        </div>
      </footer>
    </div>
  );
}
