import type { Metadata } from "next";
import LegalPageLayout from "@/components/shop/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué cookies usa 3D Island, para qué y cómo puedes gestionarlas.",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Política de cookies" updated="16 de septiembre de 2026">
      <section>
        <h2 className="text-lg font-bold text-gray-900">1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos que un sitio web almacena en tu navegador para recordar
          información sobre tu visita, como tu idioma preferido o el contenido de tu carrito.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">2. Cookies que usamos</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Técnicas (siempre activas):</strong> sesión de usuario (autenticación), carrito de
            compra, y preferencia de idioma (<code>NEXT_LOCALE</code>). Necesarias para el
            funcionamiento del sitio y exentas de consentimiento según la normativa vigente.
          </li>
          <li>
            <strong>Analíticas (opcionales):</strong> nos ayudan a entender cómo se usa el sitio para
            mejorarlo. Solo se activan si las aceptas.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">3. Gestión de tu consentimiento</h2>
        <p>
          Al visitar el sitio por primera vez, te mostramos un aviso donde puedes aceptar o rechazar
          las cookies no esenciales. Puedes cambiar tu decisión en cualquier momento borrando las
          cookies de tu navegador para que el aviso vuelva a aparecer.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">4. Cookies de terceros</h2>
        <p>
          El proceso de pago se gestiona a través de Stripe, que puede establecer sus propias cookies
          técnicas necesarias para procesar la transacción de forma segura.
        </p>
      </section>
    </LegalPageLayout>
  );
}
