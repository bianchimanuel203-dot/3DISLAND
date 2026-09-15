"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import BallpitBg from "@/components/ui/ballpit-bg";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    if (form.password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Error al crear la cuenta"); setLoading(false); return; }
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Cuenta creada pero error al iniciar sesión. Inténtalo manualmente.");
    } else {
      router.push("/shop");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/shop" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      {/* Ballpit background */}
      <div className="fixed inset-0 z-0">
        <BallpitBg
          colors={["#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#f8fafc"]}
          count={60}
        />
      </div>

      {/* Overlay suave */}
      <div className="fixed inset-0 z-[1] bg-white/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/landing" className="text-sm uppercase tracking-[0.3em] text-gray-500 hover:text-gray-900 transition-colors font-semibold">
            3D ISLAND
          </Link>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">Crear cuenta</h1>
          <p className="mt-2 text-sm text-gray-500">Únete al marketplace de impresión 3D</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md p-8 shadow-xl">
          {/* Google */}
          <button type="button" onClick={handleGoogle} disabled={googleLoading}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Conectando..." : "Registrarse con Google"}
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">o con email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre" },
              { name: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
              { name: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres" },
              { name: "confirmPassword", label: "Confirmar contraseña", type: "password", placeholder: "Repite tu contraseña" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">{field.label}</label>
                <input type={field.type} name={field.name} value={(form as any)[field.name]}
                  onChange={handleChange} required placeholder={field.placeholder}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-100" />
              </div>
            ))}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="mt-2 rounded-full bg-gray-900 hover:bg-gray-700 py-3 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 active:scale-95">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="font-semibold text-gray-900 hover:text-gray-600 transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}