import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { buildWhatsAppUrl } from "@/lib/settings-api";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { fetchPropertyById, fetchProperties, type PropertyWithDetail } from "@/lib/properties-api";


export const Route = createFileRoute("/propiedad/$id")({
  head: () => ({
    meta: [
      { title: "Propiedad — Alpha Propiedades" },
      { name: "description", content: "Detalle de propiedad en Alpha Propiedades." },
    ],
  }),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { id } = Route.useParams();
  const [property, setProperty] = useState<PropertyWithDetail | null>(null);
  const [related, setRelated] = useState<PropertyWithDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const { settings } = useSiteSettings();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setActiveIdx(0);
    (async () => {
      try {
        const p = await fetchPropertyById(id);
        if (cancelled) return;
        if (!p) {
          setNotFound(true);
          setProperty(null);
        } else {
          setProperty(p);
          const all = await fetchProperties();
          if (!cancelled) {
            setRelated(all.filter((r) => r.id !== p.id && r.provincia === p.provincia).slice(0, 3));
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center px-6 py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando propiedad…
        </div>
      </div>
    );
  }

  if (notFound || !property) {
    return (
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
    );
  }

  const gallery = property.images && property.images.length > 0 ? property.images : [property.image];

  const message = `Hola Ninoska, estoy interesado en la propiedad ${property.title} ubicada en ${property.location} con un precio de ${property.price}${property.period ? ` / ${property.period}` : ""}. Me gustaría recibir más información.`;
  const whatsappUrl = buildWhatsAppUrl(settings, message);

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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-3xl bg-muted">
            <img
              src={gallery[activeIdx]}
              alt={property.title}
              className={`aspect-[16/10] w-full object-cover ${
                property.type === "Alquiler" && property.rentalStatus === "Alquilada" ? "grayscale-[30%]" : ""
              }`}
            />
            {property.type === "Alquiler" && property.rentalStatus === "Alquilada" && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                <div className="pointer-events-none absolute left-6 top-6">
                  <span className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg ring-2 ring-white/30">
                    Actualmente Alquilada
                  </span>
                </div>
              </>
            )}
            {gallery.length > 1 && (
              <>
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
              </>
            )}
            <div className="absolute bottom-4 right-4 rounded-full bg-foreground/70 px-3 py-1 text-xs font-medium text-background">
              {activeIdx + 1} / {gallery.length}
            </div>
          </div>
          <div className="lg:relative">
            <div className="grid grid-cols-4 gap-3 lg:absolute lg:inset-0 lg:grid-cols-2 lg:content-start lg:overflow-y-auto lg:pr-1">
              {gallery.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveIdx(i)}
                  className={`relative overflow-hidden rounded-2xl transition-all ${
                    activeIdx === i ? "ring-2 ring-emerald" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Vista ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Características
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SpecCard icon={<BedDouble className="h-5 w-5" />} value={property.beds} label="Habitaciones" />
                <SpecCard icon={<Bath className="h-5 w-5" />} value={property.baths} label="Baños" />
                <SpecCard icon={<Car className="h-5 w-5" />} value={property.parking} label="Parqueos" />
                {showArea && (
                  <SpecCard icon={<Maximize2 className="h-5 w-5" />} value={property.area} label="Área" />
                )}
              </div>

            </section>

            <section className="mt-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Descripción
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
                {property.description ? (
                  <p className="whitespace-pre-line">{property.description}</p>
                ) : (
                  <>
                    <p>
                      Descubre <strong>{property.title}</strong>, una propiedad excepcional ubicada en{" "}
                      {property.canton}, una de las zonas más atractivas de {property.provincia}, Costa Rica.
                      Esta {property.type === "Venta" ? "exclusiva propiedad en venta" : "magnífica propiedad en alquiler"} ofrece{" "}
                      {property.area} de espacio diseñado con acabados modernos, abundante luz natural y vistas privilegiadas.
                    </p>
                    <p>
                      Cuenta con {property.beds} amplias habitaciones, {property.baths} baños completos y{" "}
                      {property.parking} espacios de estacionamiento. Los espacios sociales fluyen hacia áreas exteriores
                      perfectas para disfrutar del clima tropical costarricense.
                    </p>
                  </>
                )}
              </div>
            </section>

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
