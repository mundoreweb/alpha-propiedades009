import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { isAdminAuthed, loginAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Acceso Administración — Alpha Propiedades" },
      { name: "description", content: "Portal privado de acceso para el equipo de Alpha Propiedades." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isAdminAuthed().then((ok) => {
      if (ok && !cancelled) navigate({ to: "/admin" });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (await loginAdmin(email, password)) {
        navigate({ to: "/admin" });
      } else {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.62_0.14_175/0.28),transparent_55%),radial-gradient(circle_at_80%_90%,oklch(0.5_0.16_235/0.35),transparent_55%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-primary-foreground/70 hover:text-emerald"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al sitio
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald text-emerald-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Acceso Administración</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            Inicia sesión para gestionar el inventario de propiedades.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
                Correo electrónico
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 focus-within:border-emerald">
                <Mail className="h-4 w-4 text-primary-foreground/50" />
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alphapropiedades.cr"
                  className="w-full bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
                Contraseña
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 focus-within:border-emerald">
                <Lock className="h-4 w-4 text-primary-foreground/50" />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
                />
              </div>
            </label>

            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-emerald px-5 py-3 text-sm font-bold text-emerald-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Ingresando…" : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] leading-relaxed text-primary-foreground/60">
            <p className="font-semibold text-primary-foreground/80">Demo</p>
            <p>Correo: <span className="text-emerald">{ADMIN_EMAIL}</span></p>
            <p>Contraseña: <span className="text-emerald">{ADMIN_PASSWORD}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
