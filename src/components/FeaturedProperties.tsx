import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { fetchProperties, type PropertyWithDetail } from "@/lib/properties-api";

export function FeaturedProperties() {
  const [items, setItems] = useState<PropertyWithDetail[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProperties()
      .then((data) => {
        if (!cancelled) {
          const featured = data.filter((p) => p.featured);
          const list = featured.length >= 3 ? featured : data;
          setItems(list.slice(0, 6));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald">
            Selección Curada
          </span>
          <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Propiedades Destacadas
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Las mejores oportunidades inmobiliarias en Costa Rica, seleccionadas
            personalmente por nuestro equipo de expertos.
          </p>
        </div>
        <Link
          to="/propiedades"
          search={{ modo: "todas", provincia: "Todas", q: "" }}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-emerald hover:text-emerald"
        >
          Ver todas las propiedades →
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
