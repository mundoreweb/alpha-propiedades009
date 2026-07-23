import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, Home as HomeIcon, ShieldCheck, LogOut, ImagePlus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import {
  properties as seedProperties,
  provincias,
  cantonesPorProvincia,
  type CatalogProperty,
} from "@/data/properties";
import { isAdminAuthed, logoutAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de Administración — Alpha Propiedades" },
      {
        name: "description",
        content: "Panel interno para gestionar el inventario de propiedades de Alpha Propiedades.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPanel,
});

type FormState = {
  id?: string;
  title: string;
  priceUSD: string;
  type: "Venta" | "Alquiler";
  provincia: string;
  canton: string;
  description: string;
  areaNum: string;
  beds: string;
  baths: string;
  parking: string;
  images: string[];
  rentalStatus: "Disponible" | "Alquilada";
};

const EMPTY_FORM: FormState = {
  title: "",
  priceUSD: "",
  type: "Venta",
  provincia: "San José",
  canton: cantonesPorProvincia["San José"][0],
  description: "",
  areaNum: "",
  beds: "",
  baths: "",
  parking: "",
  images: [""],
  rentalStatus: "Disponible",
};

function formatPrice(usd: number) {
  return `$${usd.toLocaleString("en-US")}`;
}

function AdminPanel() {
  const location = useLocation();

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [list, setList] = useState<CatalogProperty[]>(seedProperties);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    const ok = isAdminAuthed();
    setAuthed(ok);
    setChecked(true);
    if (!ok) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);




  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.provincia.toLowerCase().includes(q) ||
        p.canton.toLowerCase().includes(q),
    );
  }, [list, query]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p: CatalogProperty) => {
    const existing = (p as CatalogProperty & { images?: string[] }).images;
    setForm({
      id: p.id,
      title: p.title,
      priceUSD: String(p.priceUSD),
      type: p.type,
      provincia: p.provincia,
      canton: p.canton,
      description: "",
      areaNum: String(p.areaNum),
      beds: String(p.beds),
      baths: String(p.baths),
      parking: String(p.parking),
      images: existing && existing.length > 0 ? existing : [typeof p.image === "string" ? p.image : ""],
      rentalStatus: p.rentalStatus ?? "Disponible",
    });
    setEditing(p.id);
    setModalOpen(true);
  };


  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar esta propiedad? Esta acción no se puede deshacer.")) {
      setList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate({ to: "/admin/login" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usd = Number(form.priceUSD) || 0;
    const cleanImages = form.images.map((s) => s.trim()).filter(Boolean);
    const primary = cleanImages[0] || (seedProperties[0].image as string);
    const item: CatalogProperty & { images?: string[] } = {
      id: editing ?? String(Date.now()),
      title: form.title,
      location: `${form.canton}, ${form.provincia}`,
      price: `$${usd.toLocaleString("en-US")}`,
      priceUSD: usd,
      period: form.type === "Alquiler" ? "mes" : undefined,
      type: form.type,
      provincia: form.provincia,
      canton: form.canton,
      beds: Number(form.beds) || 0,
      baths: Number(form.baths) || 0,
      parking: Number(form.parking) || 0,
      area: `${form.areaNum} m²`,
      areaNum: Number(form.areaNum) || 0,
      image: primary,
      images: cleanImages.length > 0 ? cleanImages : [primary as string],
      rentalStatus: form.type === "Alquiler" ? form.rentalStatus : undefined,
    };

    setList((prev) =>
      editing ? prev.map((p) => (p.id === editing ? item : p)) : [item, ...prev],
    );
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const cantones = cantonesPorProvincia[form.provincia] ?? [];

  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, ""] }));
  const removeImage = (i: number) =>
    setForm((f) => ({
      ...f,
      images: f.images.length > 1 ? f.images.filter((_, idx) => idx !== i) : [""],
    }));
  const updateImage = (i: number, v: string) =>
    setForm((f) => ({ ...f, images: f.images.map((s, idx) => (idx === i ? v : s)) }));

  if (!checked || !authed) {
    return <div className="min-h-screen bg-primary" />;
  }


  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
              <ShieldCheck className="h-4 w-4" />
              Panel de administración
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Inventario de propiedades
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona todas las propiedades publicadas en Alpha Propiedades.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-soft)]"
            >
              <Plus className="h-4 w-4" />
              Agregar propiedad
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Total" value={list.length} />
          <StatCard label="En Venta" value={list.filter((p) => p.type === "Venta").length} />
          <StatCard label="En Alquiler" value={list.filter((p) => p.type === "Alquiler").length} />
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-[var(--shadow-soft)]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, provincia o cantón…"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Propiedad</th>
                  <th className="px-5 py-3.5">Ubicación</th>
                  <th className="px-5 py-3.5">Operación</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5">Precio</th>
                  <th className="px-5 py-3.5">Detalles</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={typeof p.image === "string" ? p.image : (p.image as unknown as string)}
                          alt={p.title}
                          className="h-12 w-16 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold text-foreground">{p.title}</div>
                          <div className="text-xs text-muted-foreground">ID: {p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p.location}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.type === "Venta"
                            ? "bg-primary/10 text-primary"
                            : "bg-emerald/15 text-emerald"
                        }`}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.type === "Alquiler" ? (
                        <button
                          onClick={() =>
                            setList((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, rentalStatus: x.rentalStatus === "Alquilada" ? "Disponible" : "Alquilada" }
                                  : x,
                              ),
                            )
                          }
                          title="Cambiar estado"
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                            (p.rentalStatus ?? "Disponible") === "Alquilada"
                              ? "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-400"
                              : "bg-emerald/15 text-emerald hover:bg-emerald/25"
                          }`}
                        >
                          ● {p.rentalStatus ?? "Disponible"}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-foreground">
                      {formatPrice(p.priceUSD)}
                      {p.period && (
                        <span className="text-xs font-normal text-muted-foreground"> / {p.period}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {p.beds} hab · {p.baths} baños · {p.area}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                          aria-label="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/5 hover:text-destructive"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                      <HomeIcon className="mx-auto mb-2 h-6 w-6 opacity-50" />
                      No hay propiedades que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-card shadow-[var(--shadow-hero)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {editing ? "Editar propiedad" : "Nueva propiedad"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Completa los datos para {editing ? "actualizar" : "publicar"} la propiedad.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <Field label="Título">
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                  placeholder="Ej. Villa Bahía Tamarindo"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Operación">
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as "Venta" | "Alquiler" })
                    }
                    className={inputClass}
                  >
                    <option>Venta</option>
                    <option>Alquiler</option>
                  </select>
                </Field>
                <Field label={`Precio (USD${form.type === "Alquiler" ? " / mes" : ""})`}>
                  <input
                    required
                    type="number"
                    value={form.priceUSD}
                    onChange={(e) => setForm({ ...form, priceUSD: e.target.value })}
                    className={inputClass}
                    placeholder="0"
                  />
                </Field>
              </div>

              {form.type === "Alquiler" && (
                <Field label="Estado del alquiler">
                  <div className="flex gap-1 rounded-xl bg-muted p-1">
                    {(["Disponible", "Alquilada"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, rentalStatus: s })}
                        className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          form.rentalStatus === s
                            ? s === "Alquilada"
                              ? "bg-amber-500 text-white shadow-sm"
                              : "bg-emerald text-emerald-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        ● {s}
                      </button>
                    ))}
                  </div>
                </Field>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Provincia">
                  <select
                    value={form.provincia}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        provincia: e.target.value,
                        canton: cantonesPorProvincia[e.target.value][0],
                      })
                    }
                    className={inputClass}
                  >
                    {provincias.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Cantón">
                  <select
                    value={form.canton}
                    onChange={(e) => setForm({ ...form, canton: e.target.value })}
                    className={inputClass}
                  >
                    {cantones.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <Field label="m²">
                  <input
                    required
                    type="number"
                    value={form.areaNum}
                    onChange={(e) => setForm({ ...form, areaNum: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Hab.">
                  <input
                    required
                    type="number"
                    value={form.beds}
                    onChange={(e) => setForm({ ...form, beds: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Baños">
                  <input
                    required
                    type="number"
                    value={form.baths}
                    onChange={(e) => setForm({ ...form, baths: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Parqueos">
                  <input
                    required
                    type="number"
                    value={form.parking}
                    onChange={(e) => setForm({ ...form, parking: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Multiple images */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Galería de imágenes
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    La primera se usa como principal
                  </span>
                </div>
                <div className="space-y-3">
                  {form.images.map((url, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5"
                    >
                      <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                        {url ? (
                          <img src={url} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
                        ) : (
                          <ImagePlus className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {i === 0 ? "Principal" : `Imagen ${i + 1}`}
                          </span>
                        </div>
                        <input
                          value={url}
                          onChange={(e) => updateImage(i, e.target.value)}
                          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:outline-none"
                          placeholder="https://…"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                        aria-label="Eliminar imagen"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImage}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-emerald/50 bg-emerald/5 px-4 py-2 text-xs font-semibold text-emerald transition-colors hover:bg-emerald/10"
                >
                  <Plus className="h-3.5 w-3.5" /> Agregar otra imagen
                </button>
              </div>

              <Field label="Descripción">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe los detalles, vista, acabados, etc."
                />
              </Field>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {editing ? "Guardar cambios" : "Publicar propiedad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
