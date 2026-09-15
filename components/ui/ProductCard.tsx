"use client";

import GlassPanel from "./GlassPanel";
import { HOME_COPY } from "@/lib/homeCopy";

export type Artifact = {
  id: string;
  codename: string;
  realm: string;
  descriptor: string;
  glyph: string;
  lore: string;
};

type ProductCardProps = {
  artifact: Artifact;
};

export default function ProductCard({ artifact }: ProductCardProps) {
  return (
    <article data-artifact-card className="group h-full">
      <GlassPanel className="flex h-full flex-col transition-transform duration-500 group-hover:-translate-y-1">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="rounded-full border border-[var(--violet-mid)]/30 bg-[var(--violet-deep)]/20 px-3 py-1 font-mono text-[0.65rem] tracking-widest text-[var(--violet-glow)] uppercase">
            {artifact.realm}
          </span>
          <span className="font-mono text-[0.6rem] text-white/30">{artifact.id}</span>
        </div>
        <div
          className="mb-5 flex h-28 items-center justify-center text-5xl opacity-90"
          aria-hidden
        >
          {artifact.glyph}
        </div>
        <h3 className="font-display neon-subtle mb-2 text-lg tracking-wide text-white sm:text-xl">
          {artifact.codename}
        </h3>
        <p className="mb-3 text-sm text-[var(--violet-mid)]">{artifact.descriptor}</p>
        <p className="mt-auto text-sm leading-relaxed text-white/55">{artifact.lore}</p>
        <p className="mt-4 font-mono text-[0.65rem] tracking-[0.3em] text-[var(--violet-glow)]/70 uppercase">
          {HOME_COPY.productCard.catalogued}
        </p>
      </GlassPanel>
    </article>
  );
}
