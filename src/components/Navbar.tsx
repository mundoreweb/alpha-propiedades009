import { Link } from "@tanstack/react-router";
import { Home, Menu, Heart } from "lucide-react";
import { useState } from "react";

const navItems: Array<{ label: string; to: string; search?: Record<string, string> }> = [
  { label: "Inicio", to: "/" },
  { label: "Comprar", to: "/catalogo", search: { modo: "venta", provincia: "Todas" } },
  { label: "Alquilar", to: "/catalogo", search: { modo: "alquiler", provincia: "Todas" } },
  { label: "Explorar Zonas", to: "/explorar-zonas" },
  { label: "Nosotros", to: "/" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Home className="h-4.5 w-4.5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">Alpha</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald">Propiedades</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search as never}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Favoritos">
            <Heart className="h-4.5 w-4.5" />
          </button>
          <Link
            to="/admin"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-soft)]"
          >
            Publicar
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search as never}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <button className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Publicar
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
