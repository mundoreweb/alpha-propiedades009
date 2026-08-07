import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, Home as HomeIcon, ShieldCheck, LogOut, ImagePlus, Loader2, Star, UploadCloud, Settings2, Check } from "lucide-react";
import { uploadPropertyImage, fetchSiteSettings, updateSiteSettings, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings-api";
import { Navbar } from "@/components/Navbar";
import {
  provincias,
  cantonesPorProvincia,
} from "@/data/properties";
import { isAdminAuthed, logoutAdmin } from "@/lib/auth";
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleRentalStatus,
  type PropertyWithDetail,
} from "@/lib/properties-api";

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
  propertyCode: string;
  areaNum: string;
  beds: string;
  baths: string;
  parking: string;
  images: string[];
  rentalStatus: "Disponible" | "Alquilada";
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  priceUSD: "",
  type: "Venta",
  provincia: "San José",
  canton: cantonesPorProvincia["San José"][0],
  description: "",
  propertyCode: "",
  areaNum: "",
  beds: "",
  baths: "",
  parking: "",
  images: [""],
  rentalStatus: "Disponible",
  featured: false,
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
  const [list, setList] = useState<PropertyWithDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isAdminAuthed().then((ok) => {
      if (cancelled) return;
      setAuthed(ok);
      setChecked(true);
      if (!ok) navigate({ to: "/admin/login" });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    setLoading(true);
    fetchProperties()
      .then((data) => {
        if (!cancelled) {
          setList(data);
          setLoadError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setLoadError((e as Error).message ?? "Error al cargar propiedades");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authed]);

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

  const openEdit = (p: PropertyWithDetail) => {
    setForm({
      id: p.id,
      title: p.title,
      priceUSD: String(p.priceUSD),
      type: p.type,
      provincia: p.provincia,
      canton: p.canton,
      description: p.description ?? "",
      propertyCode: p.propertyCode ?? "",
      areaNum: String(p.areaNum),
      beds: String(p.beds),
      baths: String(p.baths),
      parking: String(p.parking),
      images: p.images && p.images.length > 0 ? p.images : [""],
      rentalStatus: p.rentalStatus ?? "Disponible",
      featured: !!p.featured,
    });
    setEditing(p.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    try {
      await deleteProperty(id);
      setList((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Error al eliminar: " + ((e as Error).message ?? "desconocido"));
    }
  };

  const handleToggleStatus = async (p: PropertyWithDetail) => {
    const current = p.rentalStatus ?? "Disponible";
    const next = current === "Alquilada" ? "Disponible" : "Alquilada";
    setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, rentalStatus: next } : x)));
    try {
      await toggleRentalStatus(p.id, current);
    } catch (e) {
      setList((prev) => prev.map((x) => (x.id === p.id ? { ...x, rentalStatus: current } : x)));
      alert("Error al cambiar estado: " + ((e as Error).message ?? "desconocido"));
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate({ to: "/admin/login" });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setUploadError(null);
    setUploading(arr.length);
    for (const file of arr) {
      try {
        const url = await uploadPropertyImage(file);
        setForm((f) => ({ ...f, images: [...f.images.filter((s) => s.trim()), url] }));
      } catch (err) {
        setUploadError("Error al subir " + file.name + ": " + ((err as Error).message ?? ""));
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usd = Number(form.priceUSD) || 0;
    const cleanImages = form.images.map((s) => s.trim()).filter(Boolean);
    const input = {
      title: form.title,
      description: form.description || null,
      property_code: form.propertyCode.trim() || null,
      price: usd,
      operation: form.type,
      rental_status: form.type === "Alquiler" ? form.rentalStatus : ("Disponible" as const),
      province: form.provincia,
      city: form.canton,
      bedrooms: Number(form.beds) || 0,
      bathrooms: Number(form.baths) || 0,
      parking: Number(form.parking) || 0,
      sqm: form.type === "Venta" ? Number(form.areaNum) || 0 : 0,
      images: cleanImages,
      is_featured: form.featured,
    };

    setSaving(true);
    try {
      if (editing) {
        const updated = await updateProperty(editing, input);
        setList((prev) => prev.map((p) => (p.id === editing ? updated : p)));
      } else {
        const created = await createProperty(input);
        setList((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      alert("Error al guardar: " + ((err as Error).message ?? "desconocido"));
    } finally {
      setSaving(false);
    }
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

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Total" value={list.length} />
          <StatCard label="En Venta" value={list.filter((p) => p.type === "Venta").length} />
          <StatCard label="En Alquiler" value={list.filter((p) => p.type === "Alquiler").length} />
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-[var(--shadow-soft)]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, provincia o cantón…"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {loadError && (
          <div className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Cargando propiedades…
                    </td>
                  </tr>
                ) : (
                  <>
                    {filtered.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-border transition-colors hover:bg-muted/40"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-12 w-16 rounded-lg object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                {p.title}
                                {p.featured && <Star className="h-3.5 w-3.5 fill-emerald text-emerald" />}
                              </div>
                              <div className="text-xs text-muted-foreground">ID: {p.id.slice(0, 8)}…</div>
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
                              onClick={() => handleToggleStatus(p)}
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
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <SettingsSection />
      </div>

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

              <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-emerald focus:ring-emerald"
                />
                <span className="text-sm text-foreground">Marcar como Destacada</span>
              </label>

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
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  className={`mt-3 rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
                    dragActive ? "border-emerald bg-emerald/10" : "border-emerald/40 bg-emerald/5"
                  }`}
                >
                  <UploadCloud className="mx-auto h-6 w-6 text-emerald" />
                  <p className="mt-2 text-xs font-semibold text-foreground">
                    Arrastra tus fotos aquí o
                  </p>
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-bold text-emerald-foreground transition-all hover:brightness-110">
                    <ImagePlus className="h-3.5 w-3.5" /> Seleccionar imágenes
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {uploading > 0 && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subiendo {uploading} imagen(es)…
                    </p>
                  )}
                  {uploadError && (
                    <p className="mt-2 text-xs font-medium text-destructive">{uploadError}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addImage}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-emerald/50 bg-emerald/5 px-4 py-2 text-xs font-semibold text-emerald transition-colors hover:bg-emerald/10"
                >
                  <Plus className="h-3.5 w-3.5" /> Agregar imagen por URL
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
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
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

function SettingsSection() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings()
      .then((s) => {
        if (!cancelled) setSettings(s);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message ?? "Error al cargar la configuración");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateSiteSettings({
        whatsapp_number: settings.whatsapp_number,
        whatsapp_message: settings.whatsapp_message,
        contact_email: settings.contact_email,
        office_address: settings.office_address,
      });
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError("Error al guardar: " + ((err as Error).message ?? "desconocido"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald">
        <Settings2 className="h-4 w-4" />
        Configuración Contacto
      </div>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
        Datos de contacto del sitio
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Estos datos alimentan todos los botones de WhatsApp y enlaces de contacto del sitio.
      </p>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando configuración…
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Número de WhatsApp (con código país)">
              <input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className={inputClass}
                placeholder="50688888888"
              />
            </Field>
            <Field label="Correo de contacto">
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className={inputClass}
                placeholder="info@alphapropiedades.cr"
              />
            </Field>
          </div>
          <Field label="Mensaje predeterminado de WhatsApp">
            <textarea
              rows={2}
              value={settings.whatsapp_message}
              onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Dirección de la oficina">
            <input
              value={settings.office_address}
              onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
              className={inputClass}
              placeholder="San José, Costa Rica"
            />
          </Field>

          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald">
                <Check className="h-4 w-4" /> Guardado
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar configuración
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
