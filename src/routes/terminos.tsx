import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones — Alpha Propiedades 009" },
      { name: "description", content: "Términos y Condiciones de uso de Alpha Propiedades 009." },
    ],
  }),
  component: TerminosPage,
});

function TerminosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: Agosto 2026</p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Bienvenido a <strong className="text-foreground">Alpha Propiedades 009</strong>. Al acceder y navegar en nuestro sitio web <strong className="text-foreground">alphapropiedades009.com</strong>, usted acepta cumplir con los siguientes Términos y Condiciones de uso.
          </p>

          <hr className="border-border my-6" />

          <h2 className="text-xl font-semibold text-foreground">1. Naturaleza del servicio</h2>
          <p>
            <strong className="text-foreground">Alpha Propiedades 009</strong> es un portal web de exhibición e intermediación inmobiliaria. La plataforma funciona como un catálogo informativo de propiedades disponibles para venta o alquiler en Costa Rica.
          </p>

          <h2 className="text-xl font-semibold text-foreground">2. Disponibilidad y precios de los inmuebles</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>La información, precios, fotografías y disponibilidad de los inmuebles mostrados están sujetos a cambios sin previo aviso.</li>
            <li>Aunque nos esforzamos por mantener la información actualizada, no garantizamos la absoluta precisión o exactitud de todos los detalles técnicos o precios publicados. La confirmación final se realizará siempre mediante atención directa.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">3. Propiedad intelectual</h2>
          <p>
            Todo el contenido del sitio web, incluyendo logotipos, textos, fotografías, código fuente y diseño gráfico, es propiedad de <strong className="text-foreground">Alpha Propiedades 009</strong> o cuenta con la autorización correspondiente para su uso. Queda prohibida la reproducción total o parcial sin autorización previa y por escrito.
          </p>

          <h2 className="text-xl font-semibold text-foreground">4. Exención de responsabilidad</h2>
          <p>
            <strong className="text-foreground">Alpha Propiedades 009</strong> no se hace responsable por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Interrupciones temporales en el servicio web por mantenimiento o fallas técnicas ajenas a nuestro control.</li>
            <li>Acuerdos o negociaciones directas entre usuarios y terceros que no hayan sido formalizadas a través de nuestros canales oficiales.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">5. Ley aplicable y jurisdicción</h2>
          <p>
            Estos Términos y Condiciones se rigen por la legislación vigente de la República de Costa Rica. Cualquier disputa o controversia será sometida a los tribunales competentes de dicha jurisdicción.
          </p>
        </div>
      </div>
    </div>
  );
}