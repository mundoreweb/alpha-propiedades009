import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { Slider } from "@/components/ui/slider";
import {
  properties,
  provincias,
  cantonesPorProvincia,
} from "@/data/properties";

const searchSchema = z.object({
  modo: fallback(z.enum(["todas", "venta", "alquiler"]), "todas").default("todas"),
  provincia: fallback(z.string(), "Todas").default("Todas"),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Catálogo de Propiedades — Alpha Propiedades" },
      { name: "description", content: "Explora y filtra propiedades en venta y alquiler en Costa Rica por provincia, precio, habitaciones y más." },
    ],
  }),
  component: Catalogo,
});

const MAX_PRICE = 1500000;

function Catalogo() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogo" });

  const [modo, setModo] = useState<"todas" | "venta" | "alquiler">(search.modo);
  const [provincia, setProvincia] = useState<string>(search.provincia);
  const [canton, setCanton] = useState<string>("Todos");
  const [price, setPrice] = useState<[number, number]>([0, MAX_PRICE]);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [parking, setParking] = useState(0);
  const [area, setArea] = useState<[number, number]>([0, 600]);
  const [openMobile, setOpenMobile] = useState(false);

  const cantones = provincia !== "Todas" ? cantonesPorProvincia[provincia] ?? [] : [];

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (modo !== "todas" && p.type.toLowerCase() !== modo) return false;
      if (provincia !== "Todas" && p.provincia !== provincia) return false;
      if (canton !== "Todos" && p.canton !== canton) return false;
      // For rent, price comparison only makes sense in venta range
      if (p.type === "Venta") {
        if (p.priceUSD < price[0] || p.priceUSD > price[1]) return false;
      }
      if (beds > 0 && p.beds < beds) return false;
      if (baths > 0 && p.baths < baths) return false;
      if (parking > 0 && p.parking < parking) return false;
      if (p.areaNum < area[0] || p.areaNum > area[1]) return false;
      return true;
    });
  }, [modo, provincia, canton, price, beds, baths, parking, area]);

  const resetFilters = () => {
    setModo("todas"); setProvincia("Todas"); setCanton("Todos");
    setPrice([0, MAX_PRICE]); setBeds(0); setBaths(0); setParking(0);
    setArea([0, 600]);
    navigate({ search: { modo: "todas", provincia: "Todas" } });
  };

  const Filters = (
    <div className="space-y-7">
      <FilterBlock title="Operación">
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {(["todas", "venta", "alquiler"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-all ${
                modo === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "todas" ? "Todas" : m === "venta" ? "Venta" : "Alquiler"}
            </button>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Ubicación">
        <div className="space-y-2">
          <select
            value={provincia}
            onChange={(e) => { setProvincia(e.target.value); setCanton("Todos"); }}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground focus:border-emerald focus:outline-none"
          >
            <option value="Todas">Todas las provincias</option>
            {provincias.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={canton}
            disabled={provincia === "Todas"}
            onChange={(e) => setCanton(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground focus:border-emerald focus:outline-none disabled:opacity-50"
          >
            <option value="Todos">{provincia === "Todas" ? "Selecciona provincia" : "Todos los cantones"}</option>
            {cantones.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </FilterBlock>

      <FilterBlock title="Rango de Precio (USD)">
        <Slider
          value={price}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
          min={0}
          max={MAX_PRICE}
          step={25000}
          className="mt-2"
        />
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>${price[0].toLocaleString()}</span>
          <span>${price[1].toLocaleString()}{price[1] === MAX_PRICE ? "+" : ""}</span>
        </div>
      </FilterBlock>

      <FilterBlock title="Características">
        <CounterRow label="Habitaciones" value={beds} onChange={setBeds} />
        <CounterRow label="Baños" value={baths} onChange={setBaths} />
        <CounterRow label="Estacionamientos" value={parking} onChange={setParking} />
      </FilterBlock>

      <FilterBlock title="Tamaño (m²)">
        <Slider
          value={area}
          onValueChange={(v) => setArea([v[0], v[1]] as [number, number])}
          min={0}
          max={600}
          step={10}
        />
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{area[0]} m²</span>
          <span>{area[1]} m²{area[1] === 600 ? "+" : ""}</span>
        </div>
      </FilterBlock>

      <button
        onClick={resetFilters}
        className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-emerald hover:text-emerald"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald">
            Catálogo
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Encuentra tu propiedad ideal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Usa los filtros para refinar tu búsqueda entre nuestras propiedades en Costa Rica.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">Filtros</h2>
              {Filters}
            </div>
          </aside>

          {/* Mobile button */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpenMobile(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </button>
          </div>

          {/* Results */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{filtered.length}</span> propiedad{filtered.length === 1 ? "" : "es"} encontrada{filtered.length === 1 ? "" : "s"}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
                <p className="text-base font-semibold text-foreground">No encontramos propiedades</p>
                <p className="mt-1 text-sm text-muted-foreground">Intenta ajustar los filtros para ver más resultados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpenMobile(false)} />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-background p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider">Filtros</h2>
              <button onClick={() => setOpenMobile(false)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function CounterRow({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition-colors ${
              value === n
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {n === 0 ? "Todos" : `${n}+`}
          </button>
        ))}
      </div>
    </div>
  );
}
