import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Compass, Leaf, TrendingUp, Sprout } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { properties, provincias } from "@/data/properties";

export const Route = createFileRoute("/explorar-zonas")({
  head: () => ({
    meta: [
      { title: "Explorar Zonas — Alpha Propiedades" },
      {
        name: "description",
        content:
          "Explora las 7 provincias de Costa Rica en un mapa interactivo y descubre por qué invertir en este paraíso tropical.",
      },
    ],
  }),
  component: ExplorarZonas,
});

/**
 * Stylized but recognizable silhouette of Costa Rica.
 * Coordinates are hand-tuned to a 700x520 viewBox so the country reads
 * elongated NW→SE with the Nicoya peninsula and Osa peninsula hinted.
 */
type ProvinciaShape = {
  name: (typeof provincias)[number];
  d: string;
  labelX: number;
  labelY: number;
  /** Hide label when too small; force tooltip-only */
  hideLabel?: boolean;
};

const COUNTRY_OUTLINE =
  "M70,210 C90,170 130,140 180,128 C210,118 245,112 280,118 L330,108 C370,100 405,108 440,128 L500,150 C545,170 590,200 630,240 C660,270 660,310 620,340 L560,375 C530,395 495,408 460,415 L420,422 L380,455 C350,478 312,488 280,478 L235,460 L195,445 C160,432 130,415 105,388 C82,360 65,322 62,285 C60,255 60,232 70,210 Z";

const SHAPES: ProvinciaShape[] = [
  // Guanacaste — NW + Nicoya peninsula
  {
    name: "Guanacaste",
    d: "M70,210 C90,170 130,140 180,128 C220,120 252,124 270,150 L262,210 L240,255 C220,275 195,288 175,295 L150,325 C130,345 110,340 95,320 C75,295 62,262 62,232 C60,222 64,215 70,210 Z",
    labelX: 158,
    labelY: 215,
  },
  // Alajuela — north central, large
  {
    name: "Alajuela",
    d: "M270,150 L330,108 C370,100 405,108 430,135 L420,200 L370,235 L310,235 L270,215 Z",
    labelX: 350,
    labelY: 175,
  },
  // Heredia — small wedge north of San José (label hidden, tooltip only)
  {
    name: "Heredia",
    d: "M370,235 L420,200 L455,215 L445,255 L395,260 Z",
    labelX: 410,
    labelY: 235,
    hideLabel: true,
  },
  // Cartago — east of San José
  {
    name: "Cartago",
    d: "M395,260 L445,255 L495,275 L490,320 L430,330 L400,305 Z",
    labelX: 450,
    labelY: 295,
  },
  // San José — central, larger so label fits
  {
    name: "San José",
    d: "M270,215 L310,235 L370,235 L395,260 L400,305 L370,330 L310,335 L268,310 L255,265 Z",
    labelX: 325,
    labelY: 285,
  },
  // Puntarenas — long Pacific belt + Osa peninsula tail
  {
    name: "Puntarenas",
    d: "M240,255 L268,310 L310,335 L370,330 L390,365 C370,395 340,418 305,425 L260,418 C230,410 205,395 185,375 L160,355 C145,338 140,320 150,300 L175,295 C195,288 220,275 240,255 Z",
    labelX: 255,
    labelY: 365,
  },
  // Limón — entire Caribbean side
  {
    name: "Limón",
    d: "M430,135 C475,140 520,160 560,185 C600,210 630,240 645,275 C655,305 640,335 605,355 L555,378 C520,395 485,408 460,412 L430,415 L405,395 L420,355 L490,335 L490,320 L495,275 L455,215 L445,200 Z",
    labelX: 530,
    labelY: 280,
  },
];

const REASONS = [
  {
    icon: Leaf,
    title: "Estilo de Vida Pura Vida",
    text:
      "Biodiversidad de clase mundial, clima tropical estable todo el año y uno de los países más seguros y felices de Latinoamérica.",
    accent: "emerald",
  },
  {
    icon: TrendingUp,
    title: "Destino Global de Inversión",
    text:
      "Alta plusvalía en costas como Guanacaste y Puntarenas, junto a un crecimiento urbano premium en el GAM (Escazú, Santa Ana, Heredia).",
    accent: "primary",
  },
  {
    icon: Sprout,
    title: "Hub Ecológico",
    text:
      "País carbono-neutral con compromiso real con la sostenibilidad. Ideal para eco-proyectos, retiros wellness y desarrollos LEED.",
    accent: "emerald",
  },
] as const;

function ExplorarZonas() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const goToProvincia = (name: string) => {
    navigate({
      to: "/catalogo",
      search: { modo: "todas", provincia: name },
    });
  };

  const countByProvincia = (name: string) =>
    properties.filter((p) => p.provincia === name).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-background">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
            <Compass className="h-4 w-4" />
            Explorar Costa Rica
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Descubre propiedades por <span className="text-emerald">provincia</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Pasa el cursor sobre el mapa y haz clic en cualquier provincia para ver el inventario
            disponible en esa zona.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Map */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="relative">
              <svg
                viewBox="0 0 700 520"
                className="h-auto w-full"
                role="img"
                aria-label="Mapa de las provincias de Costa Rica"
              >
                <defs>
                  <radialGradient id="ocean" cx="50%" cy="50%" r="65%">
                    <stop offset="0%" stopColor="oklch(0.93 0.04 215)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="oklch(0.99 0.005 240)" stopOpacity="0" />
                  </radialGradient>
                  <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="oklch(0.3 0.06 230)" floodOpacity="0.18" />
                  </filter>
                </defs>

                <rect x="0" y="0" width="700" height="520" fill="url(#ocean)" />

                {/* Country silhouette underlay for crisp outline */}
                <path
                  d={COUNTRY_OUTLINE}
                  fill="oklch(0.97 0.01 220)"
                  stroke="oklch(0.55 0.02 230)"
                  strokeWidth={1.5}
                  filter="url(#softShadow)"
                />

                {/* Provinces */}
                {SHAPES.map((s) => {
                  const isHover = hovered === s.name;
                  return (
                    <g key={s.name}>
                      <path
                        d={s.d}
                        fill={isHover ? "var(--emerald)" : "oklch(0.93 0.015 220)"}
                        stroke={isHover ? "var(--emerald)" : "oklch(0.65 0.02 230)"}
                        strokeWidth={isHover ? 2 : 1}
                        strokeLinejoin="round"
                        style={{
                          cursor: "pointer",
                          transition: "fill .25s ease, stroke .25s ease, filter .25s ease",
                          filter: isHover
                            ? "drop-shadow(0 8px 18px oklch(0.62 0.14 175 / 0.5))"
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          setHovered(s.name);
                          const svg = e.currentTarget.ownerSVGElement as SVGSVGElement;
                          const rect = svg.getBoundingClientRect();
                          setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 12 });
                        }}
                        onMouseMove={(e) => {
                          const svg = e.currentTarget.ownerSVGElement as SVGSVGElement;
                          const rect = svg.getBoundingClientRect();
                          setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 12 });
                        }}
                        onMouseLeave={() => {
                          setHovered(null);
                          setTooltip(null);
                        }}
                        onClick={() => goToProvincia(s.name)}
                      />
                      {!s.hideLabel && (
                        <text
                          x={s.labelX}
                          y={s.labelY}
                          textAnchor="middle"
                          className="pointer-events-none select-none"
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 0.2,
                            fill: isHover ? "var(--emerald-foreground)" : "oklch(0.28 0.05 230)",
                            transition: "fill .25s ease",
                          }}
                        >
                          {s.name}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Compass rose */}
                <g transform="translate(635,55)" className="pointer-events-none">
                  <circle r="18" fill="oklch(0.99 0.005 240)" stroke="oklch(0.65 0.02 230)" />
                  <path d="M0,-12 L3,0 L0,12 L-3,0 Z" fill="oklch(0.28 0.05 230)" />
                  <text y="-22" textAnchor="middle" style={{ fontSize: 9, fontWeight: 700, fill: "oklch(0.28 0.05 230)" }}>N</text>
                </g>
              </svg>

              {hovered && tooltip && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-lg"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  {hovered} · {countByProvincia(hovered)} {countByProvincia(hovered) === 1 ? "propiedad" : "propiedades"}
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Mapa estilizado · Haz clic en una provincia para filtrar el catálogo
            </p>
          </div>

          {/* Provinces list */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-bold text-foreground">Provincias</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona una provincia para ver sus propiedades.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {provincias.map((p) => {
                const count = countByProvincia(p);
                const active = hovered === p;
                return (
                  <button
                    key={p}
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => goToProvincia(p)}
                    className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-emerald bg-emerald/10"
                        : "border-border hover:border-emerald/40 hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                          active ? "bg-emerald text-emerald-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <MapPin className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{p}</span>
                        <span className="block text-xs text-muted-foreground">
                          {count} {count === 1 ? "propiedad" : "propiedades"}
                        </span>
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-emerald opacity-0 transition-opacity group-hover:opacity-100">
                      Explorar →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why invest in Costa Rica */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
              <Leaf className="h-4 w-4" />
              Pura Vida
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Por qué invertir en <span className="text-emerald">Costa Rica</span>
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Un país pequeño con un peso enorme: naturaleza, estabilidad y plusvalía sostenida.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {REASONS.map(({ icon: Icon, title, text, accent }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hero)]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    accent === "emerald"
                      ? "bg-emerald/15 text-emerald"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <div
                  className={`pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100 ${
                    accent === "emerald" ? "bg-emerald/30" : "bg-primary/25"
                  }`}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
