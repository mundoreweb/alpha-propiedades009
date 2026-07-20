import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone, MapPin, Clock, ChevronDown, CheckCircle2, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Alpha Propiedades" },
      { name: "description", content: "Ponte en contacto con Alpha Propiedades. Asesoría inmobiliaria personalizada en Costa Rica vía WhatsApp, teléfono o formulario." },
      { property: "og:title", content: "Contacto — Alpha Propiedades" },
      { property: "og:description", content: "Da el primer paso hacia tu nueva propiedad en Costa Rica." },
    ],
  }),
  component: Contacto,
});

const WA_NUMBER = "50688888888";

const faqs = [
  { q: "¿Cómo agendar una visita?", a: "Escríbenos por WhatsApp o completa el formulario indicando la propiedad y tu disponibilidad. Te confirmamos la cita en menos de 24 horas." },
  { q: "¿Puedo vender mi propiedad con ustedes?", a: "Sí. Realizamos una valoración gratuita, preparamos el material fotográfico y la publicamos en nuestros canales con acompañamiento legal completo." },
  { q: "¿Trabajan con clientes extranjeros?", a: "Absolutamente. Asesoramos a compradores internacionales en cada paso: due diligence, banca local, residencia e impuestos." },
];

function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", interes: "Comprar", mensaje: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const openWhatsApp = () => {
    const msg = `Hola Ninoska, soy ${form.nombre || "un cliente interesado"}. Tipo de interés: ${form.interes}. ${form.mensaje ? `Mensaje: ${form.mensaje}` : "Me gustaría más información."}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald/30 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald">
              Contacto
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Estamos para servirte
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              Ponte en contacto con nuestro equipo y da el primer paso hacia tu nueva propiedad en Costa Rica.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left */}
            <div className="space-y-6">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola Ninoska, me gustaría recibir asesoría de Alpha Propiedades.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl bg-emerald p-6 text-emerald-foreground shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90">Respuesta inmediata</div>
                    <div className="text-lg font-bold">Escríbenos por WhatsApp</div>
                  </div>
                </div>
                <Send className="h-5 w-5" />
              </a>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Teléfono</div>
                  <div className="mt-1 text-base font-semibold text-foreground">+506 8888 8888</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Horario</div>
                  <div className="mt-1 text-base font-semibold text-foreground">Lun–Sáb · 8am – 7pm</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cobertura</div>
                    <div className="text-base font-semibold text-foreground">San José, Escazú, Guanacaste y principales zonas de Costa Rica.</div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-2xl border border-border/60 bg-card p-2 shadow-[var(--shadow-soft)]">
                {faqs.map((f, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={f.q} className={i < faqs.length - 1 ? "border-b border-border/60" : ""}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                      >
                        <span className="text-sm font-semibold text-foreground">{f.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-emerald transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Form */}
            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-card)]">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">¡Mensaje enviado!</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Gracias {form.nombre || "por escribirnos"}. Nuestro equipo te contactará muy pronto.
                  </p>
                  <button
                    onClick={openWhatsApp}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-emerald-foreground hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" /> Continuar por WhatsApp
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">Envíanos un mensaje</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Te responderemos en menos de 24 horas.</p>
                  </div>

                  <Field label="Nombre completo" required>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className={inputCls}
                      placeholder="Tu nombre"
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Correo electrónico" required>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls}
                        placeholder="tucorreo@ejemplo.com"
                      />
                    </Field>
                    <Field label="Teléfono">
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        className={inputCls}
                        placeholder="+506 …"
                      />
                    </Field>
                  </div>

                  <Field label="Tipo de interés">
                    <select
                      value={form.interes}
                      onChange={(e) => setForm({ ...form, interes: e.target.value })}
                      className={inputCls}
                    >
                      <option>Comprar</option>
                      <option>Alquilar</option>
                      <option>Vender mi propiedad</option>
                      <option>Asesoría</option>
                    </select>
                  </Field>

                  <Field label="Mensaje" required>
                    <textarea
                      required
                      rows={4}
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                      className={`${inputCls} resize-none`}
                      placeholder="Cuéntanos qué estás buscando…"
                    />
                  </Field>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" /> Enviar mensaje
                    </button>
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald/40 bg-emerald/10 px-5 py-3 text-sm font-semibold text-emerald hover:bg-emerald/20"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-emerald focus:ring-2 focus:ring-emerald/20";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label} {required && <span className="text-emerald">*</span>}
      </span>
      {children}
    </label>
  );
}
