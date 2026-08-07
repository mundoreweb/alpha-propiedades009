import { Heart, BedDouble, Bath, Maximize2, MapPin, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type RentalStatus = "Disponible" | "Alquilada";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  period?: string;
  type: "Venta" | "Alquiler";
  beds: number;
  baths: number;
  area: string;
  areaNum?: number;
  image: string;
  featured?: boolean;
  rentalStatus?: RentalStatus;
};

export function PropertyCard({ property }: { property: Property }) {
  const isRented = property.type === "Alquiler" && property.rentalStatus === "Alquilada";
  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          width={1024}
          height={768}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isRented ? "grayscale-[35%]" : ""
          }`}
        />
        {isRented && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg ring-2 ring-white/30">
                <Lock className="h-3.5 w-3.5" /> Alquilada
              </span>
            </div>
          </>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
            {property.type}
          </span>
          {property.featured && !isRented && (
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-emerald-foreground shadow-sm"
              style={{ background: "var(--gradient-emerald)" }}
            >
              Destacada
            </span>
          )}
          {property.type === "Alquiler" && !isRented && (
            <span className="rounded-full bg-emerald px-3 py-1 text-xs font-semibold text-emerald-foreground shadow-sm">
              Disponible
            </span>
          )}
        </div>
        <button
          aria-label="Guardar favorito"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-foreground backdrop-blur transition-colors hover:bg-card hover:text-emerald"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight text-foreground">
            {property.title}
          </h3>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {property.location}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <Spec icon={<BedDouble className="h-4 w-4" />} value={`${property.beds}`} label="hab" />
          <Spec icon={<Bath className="h-4 w-4" />} value={`${property.baths}`} label="baños" />
          <Spec icon={<Maximize2 className="h-4 w-4" />} value={property.area} label="" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-xl font-bold text-foreground">
              {property.price}
              {property.period && (
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}/ {property.period}
                </span>
              )}
            </div>
          </div>
          <Link
            to="/propiedad/$id"
            params={{ id: property.id }}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      <span className="font-medium text-foreground">{value}</span>
      {label && <span>{label}</span>}
    </span>
  );
}
