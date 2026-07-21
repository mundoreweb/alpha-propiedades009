import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  MapPin,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const WHATSAPP_NUMBER = "50688888888"; // Ninoska (simulado)

export const Route = createFileRoute("/propiedad/$id")({
  loader: ({ params }) => {
    const property = properties.find((p) => p.id === params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.property.title ?? "Propiedad"} — Alpha Propiedades` },
      {
        name: "description",
        content: loaderData?.property
          ? `${loaderData.property.title} en ${loaderData.property.location}. ${loaderData.property.type} — ${loaderData.property.price}.`
          : "Detalle de propiedad",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Propiedad no encontrada</h1>
        <p className="mt-2 text-muted-foreground">La propiedad que buscas no está disponible.</p>
        <Link
          to="/propiedades"
          search={{ modo: "todas", provincia: "Todas" }}
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Ocurrió un error</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Reintentar
        </button>
      </div>
    </div>
  ),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();
  const [activeIdx, setActiveIdx] = useState(0);

  // Build a gallery using available property images (simulated with multiple shots)
  const allImages = Array.from(new Set(properties.map((p) => p.image)));
  const gallery = [
    property.image,
    ...allImages.filter((img) => img !== property.image).slice(0, 4),
  ];

  const related = properties.filter((p) => p.id !== property.id && p.provincia === property.provincia).slice(0, 3);

  const message = `Hola Ninoska, estoy interesado en la propiedad ${property.title} ubicada en ${property.location} con un precio de ${property.price}${property.period ? ` / ${property.period}` : ""}. Me gustaría recibir más información.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const next = () => setActiveIdx((i) => (i + 1) % gallery.length);
  const prev = () => setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <Link
          to="/propiedades"
          search={{ modo: "todas", provincia: "Todas" }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-emerald"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {property.type}
              </span>
              {property.featured && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-emerald-foreground"
                  style={{ background: "var(--gradient-emerald)" }}
                >
                  Destacada
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {property.title}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {property.canton}, {property.provincia}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-emerald hover:text-emerald">
              <Heart className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-emerald hover:text-emerald">
              <Share2 className="h-4 w-4" />
            </button>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{property.price}</div>
              {property.period && (
                <div className="text-xs font-medium text-muted-foreground">por {property.period}</div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-3xl bg-muted">
            <img
              src={gallery[activeIdx]}
              alt={property.title}
              className="aspect-[16/10] w-full object-cover"
            />
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md backdrop-blur hover:bg-card"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/95 text-foreground shadow-md backdrop-blur hover:bg-card"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 right-4 rounded-full bg-foreground/70 px-3 py-1 text-xs font-medium text-background">
              {activeIdx + 1} / {gallery.length}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-2">
            {gallery.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveIdx(i)}
                className={`relative overflow-hidden rounded-2xl transition-all ${
                  activeIdx === i ? "ring-2 ring-emerald" : "opacity-80 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Vista ${i + 1}`} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content + sidebar */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {/* Specs */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Características
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SpecCard icon={<BedDouble className="h-5 w-5" />} value={property.beds} label="Habitaciones" />
                <SpecCard icon={<Bath className="h-5 w-5" />} value={property.baths} label="Baños" />
                <SpecCard icon={<Car className="h-5 w-5" />} value={property.parking} label="Parqueos" />
                <SpecCard icon={<Maximize2 className="h-5 w-5" />} value={property.area} label="Área" />
              </div>
            </section>

            {/* Description */}
            <section className="mt-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Descripción
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
                <p>
                  Descubre <strong>{property.title}</strong>, una propiedad excepcional ubicada en{" "}
                  {property.canton}, una de las zonas más atractivas de {property.provincia}, Costa Rica.
                  Esta {property.type === "Venta" ? "exclusiva propiedad en venta" : "magnífica propiedad en alquiler"} ofrece{" "}
                  {property.area} de espacio diseñado con acabados modernos, abundante luz natural y vistas privilegiadas.
                </p>
                <p>
                  Cuenta con {property.beds} amplias habitaciones, {property.baths} baños completos y{" "}
                  {property.parking} espacios de estacionamiento. Los espacios sociales fluyen hacia áreas exteriores
                  perfectas para disfrutar del clima tropical costarricense, mientras que la cocina abierta de estilo
                  europeo se integra al comedor y la sala principal.
                </p>
                <p>
                  La ubicación combina la tranquilidad de un entorno natural con la cercanía a comercios, restaurantes
                  y vías principales. Una oportunidad única para vivir el auténtico estilo Pura Vida con todas las
                  comodidades modernas que tu familia merece.
                </p>
              </div>
            </section>

            {/* Location summary */}
            <section className="mt-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Ubicación
              </h2>
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">{property.canton}</div>
                  <div className="text-sm text-muted-foreground">Provincia de {property.provincia}, Costa Rica</div>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky contact card */}
          <aside>
            <div className="sticky top-24 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                    N
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Ninoska</div>
                    <div className="text-xs text-muted-foreground">Administradora Alpha Propiedades</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  ¿Te interesa esta propiedad? Conversemos por WhatsApp y resolveré todas tus dudas al instante.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
                <div className="mt-4 rounded-2xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Mensaje pre-llenado:</span>
                  <p className="mt-1.5 italic">"{message}"</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Otras propiedades en {property.provincia}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Floating WhatsApp button (mobile) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-2xl transition-transform hover:scale-105 lg:hidden"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  );
}

function SpecCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
        {icon}
      </div>
      <div className="mt-3 text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
