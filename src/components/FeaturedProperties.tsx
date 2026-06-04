import { Link } from "@tanstack/react-router";
import { PropertyCard, type Property } from "./PropertyCard";
import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";
import p6 from "@/assets/property-6.jpg";

const properties: Property[] = [
  {
    id: "1",
    title: "Villa Bahía Tamarindo",
    location: "Tamarindo, Guanacaste",
    price: "$1,250,000",
    type: "Venta",
    beds: 4, baths: 4, area: "420 m²",
    image: p1, featured: true,
  },
  {
    id: "2",
    title: "Penthouse Avenida Escazú",
    location: "Escazú, San José",
    price: "$3,800",
    period: "mes",
    type: "Alquiler",
    beds: 3, baths: 3, area: "280 m²",
    image: p2, featured: true,
  },
  {
    id: "3",
    title: "Casa Bosque Nuboso",
    location: "Monteverde, Puntarenas",
    price: "$685,000",
    type: "Venta",
    beds: 3, baths: 2, area: "310 m²",
    image: p3,
  },
  {
    id: "4",
    title: "Hacienda Pura Vida",
    location: "Atenas, Alajuela",
    price: "$890,000",
    type: "Venta",
    beds: 5, baths: 4, area: "560 m²",
    image: p4,
  },
  {
    id: "5",
    title: "Sunset Terrace Jacó",
    location: "Jacó, Puntarenas",
    price: "$2,400",
    period: "mes",
    type: "Alquiler",
    beds: 2, baths: 2, area: "180 m²",
    image: p5,
  },
  {
    id: "6",
    title: "Cabaña Montaña Verde",
    location: "Cartago Centro, Cartago",
    price: "$425,000",
    type: "Venta",
    beds: 3, baths: 2, area: "240 m²",
    image: p6,
  },
];

export function FeaturedProperties() {
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
          to="/catalogo"
          search={{ modo: "todas", provincia: "Todas" }}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-emerald hover:text-emerald"
        >
          Ver todas las propiedades →
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
