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

/**
 * Realistic silhouette of Costa Rica on a 700x520 viewBox.
 * NW (Guanacaste + Nicoya peninsula) is upper-left; SE (Osa peninsula)
 * is lower-right. Caribbean coast (Limón) is the long smoother NE→SE
 * arc. Coordinates were hand-traced from a reference map.
 */
const COUNTRY_OUTLINE =
  "M92,168 C120,150 158,142 196,146 L238,142 C266,138 292,146 312,162 L348,150 C384,142 420,148 452,168 C492,192 528,220 562,254 C596,288 622,322 638,358 C650,386 638,408 612,418 L568,432 L520,442 C492,450 468,462 448,478 C428,494 402,500 376,492 L344,478 L320,492 C298,504 274,500 256,484 L228,460 L196,448 C160,436 130,418 108,392 C86,366 72,336 70,304 C68,272 72,238 78,208 C82,190 84,178 92,168 Z";

const SHAPES: ProvinciaShape[] = [
  // Guanacaste — NW corner + Nicoya peninsula tail (Tamarindo / Nosara)
  {
    name: "Guanacaste",
    d: "M92,168 C120,150 158,142 196,146 L238,142 C260,140 278,148 290,164 L282,210 L268,250 C252,278 230,300 206,316 L186,348 C168,372 146,378 124,366 C100,352 82,330 74,302 C68,272 72,238 78,208 C82,190 84,178 92,168 Z",
    labelX: 168,
    labelY: 222,
  },
  // Alajuela — long northern belt along Nicaragua border
  {
    name: "Alajuela",
    d: "M290,164 C320,156 350,156 380,164 L420,178 L432,212 L410,244 L372,254 L330,252 L296,238 L282,210 Z",
    labelX: 358,
    labelY: 208,
  },
  // Heredia — small wedge between Alajuela and Limón, north of San José
  {
    name: "Heredia",
    d: "M410,244 L432,212 L468,222 L478,256 L450,272 L420,266 Z",
    labelX: 446,
    labelY: 248,
    hideLabel: true,
  },
  // San José — central, irregular
  {
    name: "San José",
    d: "M296,238 L330,252 L372,254 L410,244 L420,266 L450,272 L452,300 L432,330 L388,344 L344,344 L308,328 L286,300 L282,270 Z",
    labelX: 368,
    labelY: 298,
  },
  // Cartago — small, east of San José
  {
    name: "Cartago",
    d: "M450,272 L478,256 L516,266 L526,298 L498,320 L460,318 L452,300 Z",
    labelX: 488,
    labelY: 294,
  },
  // Puntarenas — long Pacific strip + Osa peninsula (SE tail)
  {
    name: "Puntarenas",
    d: "M268,250 L282,270 L286,300 L308,328 L344,344 L388,344 L432,330 L452,300 L460,318 L444,348 L406,372 L368,388 L330,402 L298,418 C278,430 258,432 240,420 L218,400 L196,378 C180,362 174,340 184,318 L206,316 C230,300 252,278 268,250 Z",
    labelX: 300,
    labelY: 384,
  },
  // Limón — entire Caribbean coast, NE→SE arc
  {
    name: "Limón",
    d: "M420,178 C460,176 498,186 534,206 C572,228 606,252 632,284 C652,310 654,336 632,358 L592,388 L548,410 L508,428 C488,438 466,440 448,432 L420,420 L406,398 L432,372 L470,348 L500,326 L526,298 L516,266 L478,256 L468,222 L432,212 Z",
    labelX: 548,
    labelY: 296,
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
                  <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.62 0.13 230)" />
                    <stop offset="55%" stopColor="oklch(0.48 0.14 235)" />
                    <stop offset="100%" stopColor="oklch(0.32 0.09 240)" />
                  </linearGradient>
                  <radialGradient id="oceanGlow" cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="oklch(0.78 0.12 200)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="oklch(0.4 0.1 235)" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M0 10 Q10 4 20 10 T40 10" fill="none" stroke="oklch(0.9 0.04 215)" strokeOpacity="0.18" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="land" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.92 0.06 145)" />
                    <stop offset="100%" stopColor="oklch(0.82 0.09 140)" />
                  </linearGradient>
                  <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="oklch(0.18 0.06 240)" floodOpacity="0.35" />
                  </filter>
                </defs>

                <rect x="0" y="0" width="700" height="520" fill="url(#ocean)" />
                <rect x="0" y="0" width="700" height="520" fill="url(#waves)" />
                <rect x="0" y="0" width="700" height="520" fill="url(#oceanGlow)" />

                {/* Country silhouette underlay for crisp outline */}
                <path
                  d={COUNTRY_OUTLINE}
                  fill="url(#land)"
                  stroke="oklch(0.35 0.05 230)"
                  strokeWidth={1.8}
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
