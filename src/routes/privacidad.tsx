import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad — Alpha Propiedades 009" },
      { name: "description", content: "Política de Privacidad de Alpha Propiedades 009." },
    ],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Política de Privacidad</h1>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: Agosto 2026</p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            En <strong className="text-foreground">Alpha Propiedades 009</strong> respetamos su privacidad y nos comprometemos a proteger los datos personales que comparta con nosotros. Esta política describe cómo recopilamos, utilizamos y resguardamos su información al visitar nuestro sitio web <strong className="text-foreground">alphapropiedades009.com</strong>.
          </p>

          <hr className="border-border my-6" />

          <h2 className="text-xl font-semibold text-foreground">1. Información que recopilamos</h2>
          <p>Podemos recopilar información personal únicamente cuando usted nos la proporciona de manera voluntaria, a través de:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Formularios de contacto:</strong> Nombre, correo electrónico, número de teléfono y mensaje.</li>
            <li><strong className="text-foreground">Consultas vía WhatsApp:</strong> Número telefónico e información provista en el mensaje.</li>
            <li><strong className="text-foreground">Datos de navegación:</strong> Dirección IP, tipo de navegador e interacción con el sitio a través de cookies técnicas para mejorar la experiencia de usuario.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">2. Uso de la información</h2>
          <p>Utilizamos la información recopilada exclusivamente para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Atender sus solicitudes de información sobre propiedades en venta o alquiler.</li>
            <li>Coordinar visitas o consultas sobre nuestros servicios inmobiliarios.</li>
            <li>Mejorar el funcionamiento y seguridad de nuestra plataforma web.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">3. Compartición de datos con terceros</h2>
          <p>
            No vendemos, alquilamos ni cedemos sus datos personales a terceros. Sus datos solo pueden ser procesados por proveedores de infraestructura tecnológica necesarios para el funcionamiento de la web (como proveedores de hosting y base de datos) bajo estrictos estándares de confidencialidad.
          </p>

          <h2 className="text-xl font-semibold text-foreground">4. Enlaces a terceros y WhatsApp</h2>
          <p>
            Nuestro sitio incluye enlaces directos a servicios de terceros, principalmente <strong className="text-foreground">WhatsApp</strong> para la atención al cliente. Al hacer clic en estos enlaces, usted será redirigido a plataformas externas que se rigen por sus propias políticas de privacidad.
          </p>

          <h2 className="text-xl font-semibold text-foreground">5. Sus derechos</h2>
          <p>
            Usted tiene derecho a acceder, rectificar, actualizar o solicitar la eliminación de sus datos personales en cualquier momento. Para ejercer estos derechos, puede ponerse en contacto con nosotros a través de nuestro formulario de contacto o correo oficial.
          </p>
        </div>
      </div>
    </div>
  );
}