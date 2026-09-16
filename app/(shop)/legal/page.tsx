import type { Metadata } from "next";
import LegalPageLayout from "@/components/shop/LegalPageLayout";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal de 3D Island: identidad, condiciones de uso y propiedad intelectual.",
};

export default function LegalPage() {
  return (
    <LegalPageLayout title="Aviso legal" updated="16 de septiembre de 2026">
      <section>
        <h2 className="text-lg font-bold text-gray-900">1. Datos identificativos</h2>
        <p>
          En cumplimiento del deber de información de la Ley 34/2002, de Servicios de la Sociedad
          de la Información y Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:
        </p>
        <ul className="list-disc pl-6">
          <li>Denominación: 3D Island</li>
          <li>Titular: Manuel Bianchi</li>
          <li>CIF/NIF: pendiente de registro</li>
          <li>Domicilio social: Fuerteventura, Islas Canarias, España</li>
          <li>Correo electrónico de contacto: manuelb11@outlook.it</li>
          <li>Registro Mercantil: [pendiente de completar, si aplica]</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">2. Objeto</h2>
        <p>
          3D Island (en adelante, &quot;el sitio&quot;) pone a disposición de los usuarios el presente sitio
          web para dar a conocer y comercializar piezas de impresión 3D fabricadas bajo demanda en
          Fuerteventura, Canarias.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">3. Condiciones de uso</h2>
        <p>
          El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación
          de las condiciones aquí recogidas. El usuario se compromete a hacer un uso adecuado de los
          contenidos y servicios ofrecidos, y a no emplearlos para incurrir en actividades ilícitas,
          contrarias a la buena fe y al orden público.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">4. Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos del sitio (textos, fotografías, diseños, modelos 3D, código fuente y
          demás elementos) son titularidad de 3D Island o de terceros que han autorizado su uso, y
          están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su
          reproducción, distribución o transformación sin autorización expresa.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">5. Legislación aplicable</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para cualquier controversia
          derivada del uso del sitio, las partes se someten a los juzgados y tribunales que
          correspondan conforme a la normativa de protección de consumidores y usuarios.
        </p>
      </section>
    </LegalPageLayout>
  );
}
