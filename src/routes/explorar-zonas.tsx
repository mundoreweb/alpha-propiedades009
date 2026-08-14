import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Compass, Leaf, TrendingUp, Sprout, X as XIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { provincias } from "@/data/properties";
import { fetchProperties, type PropertyWithDetail } from "@/lib/properties-api";

export const Route = createFileRoute("/explorar-zonas")({
  head: () => ({
    meta: [
      { title: "Explorar Zonas — Alpha Propiedades 009" },
      {
        name: "description",
        content:
          "Explora las 7 provincias de Costa Rica en un mapa interactivo y descubre por qué invertir en este paraíso tropical.",
      },
    ],
  }),
  component: ExplorarZonas,
});

type ProvinciaShape = {
  name: (typeof provincias)[number];
  d: string;
  labelX: number;
  labelY: number;
  fillClass: string;
  labelClass?: string;
};

/**
 * Native SVG paths traced from a seven-province reference map of Costa Rica.
 * The coastlines keep the real NW→SE sweep, Nicoya peninsula, Caribbean edge,
 * and Osa/Golfo Dulce shape while remaining interactive React vectors.
 */
const COUNTRY_OUTLINE =
  "M171.5,39.2 L199.8,55.8 L218.7,58.1 L235.2,68.8 L288.3,87.6 L327.2,65.2 L348.5,71.1 L372.1,86.4 L385.1,80.5 L394.5,94.7 L409.2,102.4 L409.2,111.8 L413.4,115.9 L431.1,120.7 L442.9,117.1 L460.6,130.1 L471.2,127.8 L484.2,119.5 L491.3,120.7 L501.9,115.9 L507.2,110.6 L504.2,91.2 L513.1,97.7 L532.0,154.3 L555.6,194.4 L604.5,252.8 L614.0,251.6 L618.1,254.6 L619.3,262.9 L642.9,294.7 L654.1,300.0 L662.4,314.2 L684.8,316.6 L699.5,330.1 L687.1,342.5 L681.2,342.5 L658.8,322.4 L648.2,321.3 L641.7,331.3 L648.8,341.9 L637.6,343.7 L632.3,349.0 L634.6,393.8 L632.3,410.4 L667.1,431.0 L672.4,437.5 L672.4,442.2 L663.5,451.1 L649.4,454.6 L644.1,459.9 L645.2,464.6 L638.2,472.9 L652.3,491.8 L652.3,520.1 L645.8,528.9 L635.2,530.1 L615.8,546.1 L634.6,560.2 L634.6,567.3 L639.4,573.2 L637.6,578.5 L621.1,558.4 L599.2,543.7 L596.9,536.6 L605.1,523.6 L595.7,504.8 L598.0,501.2 L590.4,495.9 L571.5,491.2 L563.8,484.7 L566.2,480.0 L563.2,477.0 L553.8,475.8 L540.2,482.3 L555.0,501.8 L564.4,504.2 L573.3,513.0 L575.6,529.5 L572.7,539.6 L542.0,527.8 L524.3,527.8 L496.0,503.0 L493.0,495.3 L496.6,487.1 L509.5,478.8 L510.7,462.3 L522.5,456.4 L523.7,445.8 L516.6,442.2 L517.8,436.3 L513.1,431.6 L510.7,421.0 L483.0,394.4 L457.0,375.5 L420.5,361.4 L414.0,350.2 L405.1,343.7 L398.0,346.0 L374.4,339.0 L357.9,339.0 L341.4,329.5 L330.2,314.8 L331.4,305.3 L338.4,295.9 L321.9,274.7 L320.8,264.0 L311.9,255.2 L301.3,256.4 L293.0,252.8 L278.9,238.7 L265.9,230.4 L262.3,231.6 L262.9,227.5 L257.6,223.3 L241.1,224.5 L234.0,218.6 L231.1,221.6 L228.7,232.2 L239.3,241.6 L242.9,252.2 L256.4,258.7 L265.9,258.7 L276.5,265.8 L283.6,264.6 L288.9,269.9 L286.5,277.0 L292.4,285.3 L280.0,302.4 L275.3,298.8 L272.4,301.8 L273.5,307.7 L261.8,317.1 L255.3,330.7 L247.6,325.4 L248.8,321.9 L238.1,312.4 L235.8,303.0 L221.0,287.1 L206.9,280.0 L166.8,274.1 L159.1,268.8 L153.2,255.8 L135.5,235.7 L127.2,216.8 L128.4,199.1 L122.5,192.1 L139.0,175.5 L134.3,163.7 L140.8,158.4 L150.2,157.2 L165.0,144.9 L157.9,137.8 L160.3,135.4 L159.1,118.9 L150.2,111.2 L137.3,110.0 L116.6,94.1 L126.6,87.6 L134.9,91.2 L150.2,87.6 L153.2,82.3 L146.1,74.1 L159.1,69.3 L155.6,62.3 L163.8,45.7 L171.5,39.2 Z";

const SHAPES: ProvinciaShape[] = [
  // Guanacaste — NW corner + Nicoya peninsula tail (Tamarindo / Nosara)
  {
    name: "Guanacaste",
    d: "M171.5,39.2 L177.4,40.4 L185.6,49.9 L199.8,55.8 L218.7,58.1 L233.4,67.0 L226.9,73.5 L219.9,69.9 L212.8,73.5 L196.8,88.2 L198.0,95.3 L209.2,107.7 L219.9,113.6 L225.8,121.8 L244.6,123.0 L268.2,133.7 L278.9,150.2 L296.6,157.2 L312.5,172.0 L311.3,194.4 L304.8,193.8 L300.7,198.0 L292.4,220.4 L282.4,230.4 L270.6,219.8 L262.3,225.7 L241.1,224.5 L234.0,218.6 L231.1,221.6 L228.7,232.2 L244.0,249.9 L241.1,257.6 L229.3,258.7 L224.0,266.4 L239.3,280.6 L239.3,291.2 L234.0,301.2 L221.0,287.1 L206.9,280.0 L193.9,280.0 L160.9,270.5 L153.2,255.8 L135.5,235.7 L127.2,216.8 L128.4,199.1 L122.5,190.9 L139.0,175.5 L134.3,163.7 L140.8,158.4 L150.2,157.2 L165.0,144.9 L157.9,137.8 L160.3,135.4 L159.1,118.9 L150.2,111.2 L137.3,110.0 L116.6,94.1 L126.6,87.6 L134.9,91.2 L150.2,87.6 L153.2,82.3 L146.1,74.1 L159.1,69.3 L155.6,62.3 L163.8,45.7 L171.5,39.2 Z",
    labelX: 212,
    labelY: 154,
    fillClass: "fill-map-guanacaste",
  },
  {
    name: "Alajuela",
    d: "M327.2,65.2 L348.5,71.1 L372.1,86.4 L385.1,80.5 L394.5,94.7 L409.2,102.4 L409.2,111.8 L419.9,117.7 L422.2,200.3 L418.7,249.9 L403.9,265.8 L369.7,267.0 L357.9,272.9 L350.8,281.1 L329.0,273.5 L348.5,258.7 L351.4,252.2 L338.4,242.8 L332.6,232.2 L332.6,208.6 L327.2,204.4 L319.0,209.2 L311.3,200.3 L312.5,169.6 L296.6,156.1 L278.9,149.0 L268.2,132.5 L244.6,121.8 L226.9,121.8 L207.5,104.7 L196.8,89.4 L214.0,73.5 L228.1,74.6 L234.0,67.6 L290.7,87.6 L327.2,65.2 Z",
    labelX: 326,
    labelY: 137,
    fillClass: "fill-map-alajuela",
  },
  {
    name: "Heredia",
    d: "M421.6,117.1 L431.1,120.7 L442.9,117.1 L460.6,130.1 L471.2,127.8 L484.2,119.5 L488.9,119.5 L493.0,128.3 L474.1,143.7 L475.3,172.0 L468.2,180.3 L468.2,186.2 L471.8,192.1 L471.8,195.6 L468.2,199.1 L471.8,208.6 L450.5,227.5 L449.4,236.9 L443.5,241.6 L443.5,253.4 L434.6,259.9 L418.1,259.9 L414.0,257.0 L418.7,249.9 L419.9,205.0 L422.2,200.3 L419.9,193.2 L418.7,123.6 L421.6,117.1 Z",
    labelX: 448,
    labelY: 178,
    fillClass: "fill-map-heredia",
    labelClass: "text-[10px]",
  },
  {
    name: "San José",
    d: "M455.9,225.7 L458.8,229.8 L455.3,233.4 L457.6,240.4 L467.1,248.7 L468.2,255.8 L446.4,263.4 L441.1,272.3 L444.6,278.2 L430.5,292.4 L434.6,297.7 L446.4,296.5 L460.6,311.8 L470.0,314.2 L477.1,323.6 L485.4,324.8 L491.3,334.2 L510.1,331.9 L532.6,344.9 L539.0,343.1 L537.9,353.7 L544.4,363.8 L549.7,365.5 L540.2,371.4 L530.8,386.8 L529.6,391.5 L537.9,400.9 L537.9,406.8 L532.6,413.3 L524.3,413.3 L516.0,408.6 L500.7,390.9 L484.2,389.7 L477.1,383.8 L474.1,380.9 L476.5,375.0 L474.1,369.1 L464.1,357.8 L455.9,356.7 L441.7,344.9 L436.4,332.5 L421.6,318.9 L383.9,316.6 L374.4,327.2 L366.2,328.3 L355.6,327.2 L349.1,314.8 L347.9,304.2 L353.8,295.9 L350.2,282.9 L356.7,276.4 L368.5,269.3 L392.1,270.5 L415.7,261.1 L422.8,263.4 L438.2,261.1 L447.0,253.4 L445.8,242.8 L454.1,234.5 L452.9,228.6 L455.9,225.7 Z",
    labelX: 421,
    labelY: 305,
    fillClass: "fill-map-sanjose",
  },
  {
    name: "Cartago",
    d: "M461.8,232.8 L481.8,243.4 L504.2,250.5 L513.7,257.6 L560.9,258.7 L562.6,260.5 L560.3,266.4 L560.3,287.6 L549.7,300.6 L545.0,312.4 L534.3,321.9 L530.8,331.3 L533.1,338.4 L531.4,340.1 L517.2,333.1 L512.5,328.3 L506.6,328.3 L503.1,331.9 L493.6,331.9 L487.7,323.6 L478.3,321.3 L471.2,311.8 L461.8,308.3 L450.0,294.1 L435.8,295.3 L434.0,293.5 L447.0,280.6 L445.8,272.3 L450.0,264.6 L466.5,262.3 L471.8,258.1 L471.8,252.2 L468.2,245.2 L460.0,236.9 L461.8,232.8 Z",
    labelX: 512,
    labelY: 288,
    fillClass: "fill-map-cartago",
  },
  {
    name: "Puntarenas",
    d: "M304.8,197.4 L316.6,210.3 L328.4,206.8 L331.4,209.8 L331.4,233.4 L337.3,244.0 L349.1,253.4 L326.6,273.5 L350.2,285.3 L352.6,295.9 L347.9,303.0 L347.9,313.6 L356.7,328.3 L374.4,328.3 L380.3,318.9 L387.4,316.6 L420.5,318.9 L436.4,333.7 L440.5,344.9 L455.9,357.8 L467.1,360.8 L475.3,371.4 L474.1,382.0 L477.1,385.0 L483.0,389.7 L498.3,389.7 L514.9,408.6 L525.5,414.5 L531.4,414.5 L537.9,408.0 L537.9,399.7 L530.8,389.1 L542.6,369.1 L550.3,367.3 L557.3,370.8 L566.8,363.8 L603.4,383.8 L608.7,389.1 L609.9,398.6 L618.7,402.7 L629.3,415.7 L641.1,414.5 L671.2,435.1 L672.4,442.2 L663.5,451.1 L649.4,454.6 L638.2,472.9 L652.3,491.8 L652.3,520.1 L645.8,528.9 L635.2,530.1 L615.8,546.1 L634.6,560.2 L634.6,567.3 L639.4,573.2 L637.6,578.5 L621.1,558.4 L599.2,543.7 L596.9,536.6 L605.1,523.6 L595.7,504.8 L598.0,501.2 L590.4,495.9 L571.5,491.2 L563.8,484.7 L566.2,480.0 L563.2,477.0 L553.8,475.8 L540.2,482.3 L555.0,501.8 L564.4,504.2 L573.3,513.0 L575.6,529.5 L572.7,539.6 L542.0,527.8 L524.3,527.8 L493.0,500.0 L496.6,487.1 L504.2,484.1 L510.7,476.4 L510.7,462.3 L522.5,456.4 L523.7,445.8 L516.6,442.2 L517.8,436.3 L513.1,431.6 L510.7,421.0 L483.0,394.4 L446.4,369.6 L420.5,361.4 L414.0,350.2 L405.1,343.7 L398.0,346.0 L374.4,339.0 L357.9,339.0 L339.6,327.8 L330.2,314.8 L331.4,305.3 L338.4,295.9 L321.9,274.7 L320.8,264.0 L311.9,255.2 L301.3,256.4 L293.0,252.8 L278.9,238.7 L260.6,229.8 L270.6,224.5 L283.6,233.9 L296.0,220.4 L297.1,209.8 L304.8,197.4 Z M247.0,254.0 L261.2,259.9 L265.9,258.7 L276.5,265.8 L283.6,264.6 L288.9,269.9 L286.5,277.0 L292.4,285.3 L280.0,302.4 L275.3,298.8 L272.4,301.8 L273.5,307.7 L261.8,317.1 L255.3,330.7 L247.6,325.4 L248.8,321.9 L237.0,310.1 L241.7,278.2 L227.5,266.4 L229.3,261.1 L241.1,259.9 L247.0,254.0 Z",
    labelX: 540,
    labelY: 455,
    fillClass: "fill-map-puntarenas",
  },
  {
    name: "Limón",
    d: "M504.2,91.2 L515.5,102.4 L532.0,154.3 L555.6,194.4 L604.5,252.8 L614.0,251.6 L618.1,254.6 L619.3,262.9 L642.9,294.7 L654.1,300.0 L662.4,314.2 L684.8,316.6 L699.5,330.1 L687.1,342.5 L681.2,342.5 L658.8,322.4 L648.2,321.3 L645.2,324.2 L641.7,331.3 L648.8,341.9 L637.6,343.7 L632.3,349.0 L634.6,408.0 L631.7,410.9 L619.9,398.0 L614.6,397.4 L613.4,386.8 L598.6,377.9 L593.9,369.6 L578.6,368.5 L570.3,361.4 L557.3,364.9 L544.4,363.8 L539.0,354.9 L541.4,350.2 L534.3,333.7 L535.5,326.6 L548.5,314.8 L553.2,301.8 L562.6,290.0 L566.2,259.3 L562.1,255.2 L523.1,254.0 L519.6,256.4 L506.6,246.9 L493.6,245.8 L468.8,232.8 L465.3,223.3 L461.8,230.4 L452.9,226.3 L474.1,206.2 L474.1,193.2 L469.4,181.4 L476.5,174.4 L475.3,144.9 L495.4,129.5 L491.8,120.1 L507.2,110.6 L504.2,91.2 Z",
    labelX: 600,
    labelY: 255,
    fillClass: "fill-map-limon",
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
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const [items, setItems] = useState<PropertyWithDetail[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProperties()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selectProvincia = (name: string) => {
    setSelected((prev) => (prev === name ? null : name));
  };

  const countByProvincia = (name: string) =>
    items.filter((p) => p.provincia === name).length;

  const selectedProperties = selected
    ? items.filter((p) => p.provincia === selected)
    : [];

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
                viewBox="-14 -44 728 644"
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

                <rect x="-14" y="-44" width="728" height="644" fill="url(#ocean)" />
                <rect x="-14" y="-44" width="728" height="644" fill="url(#waves)" />
                <rect x="-14" y="-44" width="728" height="644" fill="url(#oceanGlow)" />

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
                  const isSelected = selected === s.name;
                  const active = isHover || isSelected;
                  return (
                    <g key={s.name}>
                      <path
                        d={s.d}
                        className={`${active ? "fill-emerald stroke-emerald" : `${s.fillClass} stroke-primary/45`} transition-all`}
                        strokeWidth={isSelected ? 2.5 : active ? 2 : 1}
                        strokeLinejoin="round"
                        style={{
                          cursor: "pointer",
                          transition: "fill .25s ease, stroke .25s ease, filter .25s ease",
                          filter: active
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
                        onClick={() => selectProvincia(s.name)}
                      />
                      <text
                        x={s.labelX}
                        y={s.labelY}
                        textAnchor="middle"
                        className={`pointer-events-none select-none font-bold ${active ? "fill-emerald-foreground" : "fill-primary"} ${s.labelClass ?? "text-xs"}`}
                        style={{
                          fontFamily: "var(--font-sans)",
                          letterSpacing: 0.2,
                          transition: "fill .25s ease",
                        }}
                      >
                        {s.name}
                      </text>
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
              Mapa estilizado · Haz clic en una provincia para filtrar las propiedades
            </p>
          </div>

          {/* Provinces list */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Provincias</h2>
              {selected && (
                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-emerald hover:text-emerald"
                >
                  <XIcon className="h-3 w-3" /> Limpiar
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona una provincia para ver sus propiedades.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {provincias.map((p) => {
                const count = countByProvincia(p);
                const isHover = hovered === p;
                const isSelected = selected === p;
                const active = isHover || isSelected;
                return (
                  <button
                    key={p}
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => selectProvincia(p)}
                    className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                      isSelected
                        ? "border-emerald bg-emerald/10 ring-2 ring-emerald/30"
                        : active
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
                    <span className={`text-xs font-semibold text-emerald transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      {isSelected ? "Activa" : "Ver →"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filtered properties (two-way sync with map + list) */}
        {selected && (
          <div className="mt-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
                  <MapPin className="h-4 w-4" />
                  Provincia seleccionada
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Propiedades en <span className="text-emerald">{selected}</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedProperties.length} {selectedProperties.length === 1 ? "resultado" : "resultados"} disponibles en esta zona.
                </p>
              </div>
              <Link
                to="/propiedades"
                search={{ modo: "todas", provincia: selected } as never}
                className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:self-auto"
              >
                Ver en catálogo completo →
              </Link>
            </div>

            {selectedProperties.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
                <p className="text-sm font-semibold text-foreground">Aún no hay propiedades listadas en {selected}.</p>
                <p className="mt-1 text-xs text-muted-foreground">Estamos ampliando nuestro inventario en esta zona.</p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {selectedProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        )}
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
