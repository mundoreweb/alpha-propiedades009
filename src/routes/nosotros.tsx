import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Compass, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { buildWhatsAppUrl } from "@/lib/settings-api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Sobre Nosotros — Alpha Propiedades 009" },
      {
        name: "description",
        content:
          "Conoce a Ninoska Valladares y al equipo de Alpha Propiedades, tu aliado de confianza en el mercado inmobiliario de Costa Rica.",
      },
      { property: "og:title", content: "Sobre Nosotros — Alpha Propiedades 009" },
      {
        property: "og:description",
        content:
          "Asesoría personalizada, experiencia local y transparencia total en bienes raíces en Costa Rica.",
      },
    ],
  }),
  component: Nosotros,
});

const pillars = [
  {
    icon: Heart,
    title: "Asesoría Personalizada",
    text: "Entendemos tus necesidades únicas en cada paso del proceso.",
  },
  {
    icon: Compass,
    title: "Experiencia Local",
    text: "Conocimiento profundo de las mejores zonas, cantones y plusvalía en Costa Rica.",
  },
  {
    icon: ShieldCheck,
    title: "Transparencia Total",
    text: "Acompañamiento legal y comercial claro, honesto y sin sorpresas.",
  },
  {
    icon: Sparkles,
    title: "Gestión Eficiente",
    text: "Proceso ágil y simplificado para compradores y vendedores.",
  },
];

const stats = [
  { value: "+100", label: "Propiedades gestionadas" },
  { value: "7", label: "Provincias cubiertas" },
  { value: "98%", label: "Clientes satisfechos" },
  { value: "+10", label: "Años de experiencia" },
];

function Nosotros() {
  const { settings } = useSiteSettings();
  const WHATSAPP = buildWhatsAppUrl(
    settings,
    "Hola Ninoska, me gustaría recibir asesoría de Alpha Propiedades 009.",
  );
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-emerald/30 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald">
              <Sparkles className="h-3.5 w-3.5" /> Alpha Propiedades 009
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Conoce Alpha Propiedades 009
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              Tu aliado de confianza en el mercado inmobiliario de Costa Rica.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
              <img
                src="/Nosotros.jpeg"
                alt="Sobre Nosotros - Alpha Propiedades"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald">
                Nuestra historia
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Guiados por Ninoska Valladares
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Alpha Propiedades 009 nació con una convicción simple: comprar, vender o alquilar
                una casa en Costa Rica debe ser una experiencia clara, humana y bien acompañada.
                Bajo el liderazgo de <strong className="text-foreground">Ninoska Valladares</strong>
                , ayudamos a familias, inversionistas y expatriados a encontrar la propiedad
                correcta en el cantón correcto.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Combinamos conocimiento local de las 7 provincias, transparencia total en cada
                trámite y una pasión genuina por el estilo de vida <em>pura vida</em>. Nuestro
                compromiso es que cada cliente se sienta acompañado del primer mensaje al día de
                entrega de llaves.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/propiedades"
                  search={{ modo: "todas", provincia: "Todas" } as never}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Ver catálogo
                </Link>
                <Link
                  to="/contacto"
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald">
                Pilares
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Nuestros pilares de excelencia
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald transition-colors group-hover:bg-emerald group-hover:text-emerald-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl bg-primary p-10 text-primary-foreground shadow-[var(--shadow-hero)] md:p-14">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-4xl font-bold tracking-tight text-emerald md:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-border/60 bg-card p-10 text-center shadow-[var(--shadow-soft)] md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                ¿Listo para dar el siguiente paso?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Explora nuestro catálogo o escríbenos directamente por WhatsApp para asesoría
                inmediata.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/propiedades"
                search={{ modo: "todas", provincia: "Todas" } as never}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ver propiedades
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-emerald-foreground hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
