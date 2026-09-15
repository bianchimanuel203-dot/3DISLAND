"use client";
import type { ReactNode } from "react";
import { orbitron } from "@/lib/fonts";
import { SessionProvider } from "next-auth/react";
import Sidecart from "@/components/shop/Sidecart";

export default function ShopGroupLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className={`${orbitron.variable} font-display min-h-screen antialiased bg-white`}>
        <div className="min-h-screen text-gray-900">{children}</div>
        <Sidecart />
      </div>
    </SessionProvider>
  );
}