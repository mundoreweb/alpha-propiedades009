import { Link } from "@tanstack/react-router";
import { Home, Instagram, Facebook } from "lucide-react";

// Componente de icono SVG para TikTok
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 2.88 6.332 6.332 0 0 0 7.379 9.387 6.33 6.33 0 0 0 4.477-5.96V9.083a8.232 8.232 0 0 0 4.771 1.516V7.155a4.79 4.79 0 0 1-2.002-.469z" />
    </svg>
  );
}

// Configuración de redes sociales
const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/alpha_propiedades009?igsi=NnJkcnRhbnpmdHZl&utm_source=qr", // Reemplazar con la URL real
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1CSvHJxLxG/?mibextid=wwXIfr", // Reemplazar con la URL real
    icon: Facebook,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@alphapropiedades009?_r=1&_t=ZS-99QXA7n3rTY", // Reemplazar con la URL real
    icon: TikTokIcon,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          
          {/* Logo, Marca y Redes Sociales */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Home className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-foreground">Alpha</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald">
                  Propiedades 009
                </span>
              </div>
            </div>

            {/* Iconos de Redes Sociales */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-foreground hover:scale-105"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navegación Principal */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Inicio</Link>
            <Link to="/propiedades" search={{ modo: "todas", provincia: "Todas" } as never} className="text-muted-foreground hover:text-foreground">Catálogo</Link>
            <Link to="/explorar-zonas" className="text-muted-foreground hover:text-foreground">Explorar Zonas</Link>
            <Link to="/nosotros" className="text-muted-foreground hover:text-foreground">Nosotros</Link>
            <Link to="/contacto" className="text-muted-foreground hover:text-foreground">Contacto</Link>
          </div>
        </div>

        {/* Sección inferior con Copyright y Enlaces Legales */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Alpha Propiedades 009 · Costa Rica.</p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacidad" className="hover:text-foreground transition-colors">
              Política de Privacidad
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link to="/terminos" className="hover:text-foreground transition-colors">
              Términos y Condiciones
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              to="/admin/login"
              className="text-[11px] tracking-wide text-muted-foreground/70 hover:text-emerald"
            >
              Acceso Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
