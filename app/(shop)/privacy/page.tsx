import type { Metadata } from "next";
import LegalPageLayout from "@/components/shop/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo 3D Island recopila, usa y protege tus datos personales.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Política de privacidad" updated="16 de septiembre de 2026">
      <section>
        <h2 className="text-lg font-bold text-gray-900">1. Responsable del tratamiento</h2>
        <p>
          3D Island, con domicilio en Fuerteventura, Islas Canarias, España [dirección completa
          pendiente], es responsable del tratamiento de los datos personales que nos facilites a
          través de este sitio web. Contacto: [correo electrónico pendiente de completar].
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">2. Datos que recopilamos</h2>
        <ul className="list-disc pl-6">
          <li>Datos de cuenta: nombre, correo electrónico, contraseña (cifrada).</li>
          <li>Datos de pedido: dirección de envío, historial de compras.</li>
          <li>Datos de pago: procesados directamente por Stripe; 3D Island no almacena datos de tarjeta.</li>
          <li>Datos de navegación: cookies técnicas y, si las aceptas, cookies analíticas (ver nuestra <a href="/cookies" className="text-purple-600 hover:underline">Política de cookies</a>).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">3. Finalidad del tratamiento</h2>
        <p>
          Gestionar tu cuenta y pedidos, procesar pagos, responder a solicitudes de creación
          personalizada, y, cuando lo autorices, enviarte comunicaciones comerciales.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">4. Base legal</h2>
        <p>
          Ejecución del contrato de compraventa, consentimiento del usuario para cookies no esenciales
          y comunicaciones comerciales, e interés legítimo para la seguridad del sitio.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">5. Destinatarios</h2>
        <p>
          Tus datos pueden compartirse con proveedores de servicios estrictamente necesarios para la
          prestación del servicio: Stripe (procesamiento de pagos), Web3Forms (formularios de
          contacto/solicitud) y proveedores de alojamiento. No se venden datos a terceros.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">6. Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
          portabilidad escribiendo a [correo electrónico pendiente de completar]. También puedes
          reclamar ante la Agencia Española de Protección de Datos (AEPD).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">7. Conservación de datos</h2>
        <p>
          Conservamos tus datos mientras mantengas una cuenta activa y, tras su baja, durante los
          plazos legalmente exigidos para atender obligaciones fiscales y mercantiles.
        </p>
      </section>
    </LegalPageLayout>
  );
}
