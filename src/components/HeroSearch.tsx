import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-villa.jpg";

const provincias = [
  "Todas las provincias",
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
];

type Modo = "venta" | "alquiler";

export function HeroSearch() {
  const [modo, setModo] = useState<Modo>("venta");
  const [provincia, setProvincia] = useState(provincias[0]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate({
      to: "/propiedades",
      search: {
        modo,
        provincia: provincia === "Todas las provincias" ? "Todas" : provincia,
        q: query.trim(),
      },
    });
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Villa de lujo en Costa Rica al atardecer"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Costa Rica · Pura Vida
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Encuentra el hogar
            <span className="block bg-gradient-to-r from-emerald via-emerald to-white/90 bg-clip-text text-transparent">
              de tus sueños
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg">
            Propiedades exclusivas en venta y alquiler en las zonas más codiciadas
            de Costa Rica.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-3xl bg-card p-2.5 shadow-[var(--shadow-hero)] ring-1 ring-black/5">
            <div className="flex gap-1 rounded-2xl bg-muted p-1">
              {(["venta", "alquiler"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModo(m)}
                  className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition-all ${
                    modo === m
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "venta" ? "En Venta" : "En Alquiler"}
                </button>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 p-2 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-muted">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por zona, propiedad, palabra clave..."
                  className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-muted md:border-l md:border-border">
                <MapPin className="h-5 w-5 text-emerald" />
                <select
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm font-medium text-foreground focus:outline-none"
                >
                  {provincias.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-emerald-foreground transition-all hover:opacity-95 hover:shadow-lg"
                style={{ background: "var(--gradient-emerald)" }}
              >
                <Search className="h-4 w-4" />
                Buscar
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/80">
            <Stat value="2,400+" label="Propiedades" />
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <Stat value="7" label="Provincias" />
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <Stat value="98%" label="Clientes felices" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-bold text-white">{value}</span>
      <span className="text-white/70">{label}</span>
    </span>
  );
}
