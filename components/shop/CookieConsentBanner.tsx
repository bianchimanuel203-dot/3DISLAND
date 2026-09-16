"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "3disland-cookie-consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // localStorage puede no estar disponible (modo privado); el aviso simplemente no persistirá.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:px-6"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-gray-700 sm:text-left">
          Usamos cookies técnicas necesarias para el funcionamiento del sitio y, si lo aceptas,
          cookies analíticas para mejorarlo. Consulta nuestra{" "}
          <Link href="/cookies" className="text-purple-600 hover:underline">
            Política de cookies
          </Link>.
        </p>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
