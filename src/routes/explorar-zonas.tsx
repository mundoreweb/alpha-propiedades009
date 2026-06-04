import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Compass } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { properties, provincias } from "@/data/properties";

export const Route = createFileRoute("/explorar-zonas")({
  head: () => ({
    meta: [
      { title: "Explorar Zonas — Alpha Propiedades" },
      {
        name: "description",
        content:
          "Explora las 7 provincias de Costa Rica en un mapa interactivo y encuentra propiedades en cada zona.",
      },
    ],
  }),
  component: ExplorarZonas,
});

type ProvinciaShape = {
  name: (typeof provincias)[number];
  // simplified stylized polygon coordinates (not geographically exact)
  d: string;
  labelX: number;
  labelY: number;
};

const SHAPES: ProvinciaShape[] = [
  { name: "Guanacaste", d: "M40,140 L180,90 L230,170 L210,240 L100,260 L50,210 Z", labelX: 130, labelY: 185 },
  { name: "Alajuela", d: "M230,90 L370,90 L390,200 L320,220 L240,200 L210,150 Z", labelX: 305, labelY: 150 },
  { name: "Heredia", d: "M340,210 L420,200 L440,260 L370,275 L320,260 Z", labelX: 380, labelY: 240 },
  { name: "Cartago", d: "M370,275 L470,250 L505,310 L420,335 L355,310 Z", labelX: 425, labelY: 295 },
  { name: "San José", d: "M240,210 L355,225 L420,330 L350,380 L260,360 L210,290 Z", labelX: 310, labelY: 305 },
  { name: "Puntarenas", d: "M50,265 L240,260 L260,360 L350,385 L370,460 L240,495 L130,430 L70,360 Z", labelX: 180, labelY: 390 },
  { name: "Limón", d: "M420,200 L600,160 L660,300 L620,430 L515,420 L470,360 L440,260 Z", labelX: 540, labelY: 300 },
];

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
                viewBox="0 0 700 540"
                className="h-auto w-full"
                role="img"
                aria-label="Mapa estilizado de las provincias de Costa Rica"
              >
                {/* Ocean glow background */}
                <defs>
                  <radialGradient id="ocean" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="oklch(0.95 0.04 200)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="oklch(0.99 0.005 240)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="700" height="540" fill="url(#ocean)" />

                {SHAPES.map((s) => {
                  const isHover = hovered === s.name;
                  return (
                    <g key={s.name}>
                      <path
                        d={s.d}
                        fill={isHover ? "var(--emerald)" : "var(--muted)"}
                        stroke={isHover ? "var(--emerald)" : "var(--border)"}
                        strokeWidth={isHover ? 2.5 : 1.5}
                        style={{
                          cursor: "pointer",
                          transition: "fill .25s ease, stroke .25s ease, filter .25s ease",
                          filter: isHover
                            ? "drop-shadow(0 8px 20px oklch(0.62 0.14 175 / 0.45))"
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          setHovered(s.name);
                          const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                          const parent = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            x: parent.left - rect.left + parent.width / 2,
                            y: parent.top - rect.top - 8,
                          });
                        }}
                        onMouseMove={(e) => {
                          const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                          setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 12 });
                        }}
                        onMouseLeave={() => {
                          setHovered(null);
                          setTooltip(null);
                        }}
                        onClick={() => goToProvincia(s.name)}
                      />
                      <text
                        x={s.labelX}
                        y={s.labelY}
                        textAnchor="middle"
                        className="pointer-events-none select-none"
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 13,
                          fontWeight: 600,
                          fill: isHover ? "var(--emerald-foreground)" : "var(--foreground)",
                          transition: "fill .25s ease",
                        }}
                      >
                        {s.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {hovered && tooltip && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-lg"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  {hovered} · {countByProvincia(hovered)} propiedades
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
    </div>
  );
}
