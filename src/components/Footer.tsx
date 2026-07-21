import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Home className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-foreground">Alpha</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald">
                Propiedades
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Inicio</Link>
            <Link to="/catalogo" search={{ modo: "todas", provincia: "Todas" } as never} className="text-muted-foreground hover:text-foreground">Catálogo</Link>
            <Link to="/explorar-zonas" className="text-muted-foreground hover:text-foreground">Explorar Zonas</Link>
            <Link to="/nosotros" className="text-muted-foreground hover:text-foreground">Nosotros</Link>
            <Link to="/contacto" className="text-muted-foreground hover:text-foreground">Contacto</Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Alpha Propiedades · Costa Rica.</p>
          <Link
            to="/admin/login"
            className="text-[11px] tracking-wide text-muted-foreground/70 hover:text-emerald"
          >
            Acceso Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
