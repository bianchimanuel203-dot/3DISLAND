"use client";

import { useRef } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import ProductCard from "@/components/ui/ProductCard";
import { HOME_ARTIFACTS, HOME_COPY } from "@/lib/homeCopy";
import { useSectionAnimations } from "./useScrollExperience";

export default function ScrollSections() {
  const containerRef = useRef<HTMLElement>(null);
  useSectionAnimations(containerRef, true);

  return (
    <main
      ref={containerRef}
      className="scroll-content-layer relative z-10 -mt-[40vh] font-display text-white"
    >
      <section
        data-scroll-section
        className="flex min-h-[50vh] flex-col items-center justify-end px-[5%] pb-16 pt-[30vh] text-center"
      >
        <p className="mb-4 font-mono text-[0.7rem] tracking-[0.45em] text-[var(--violet-mid)] uppercase sm:text-xs">
          {HOME_COPY.hero.scrollHint}
        </p>
        <h1 className="neon-violet m-0 max-w-4xl text-[clamp(2.2rem,10vw,4.5rem)] font-black tracking-[0.15em]">
          {HOME_COPY.hero.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[clamp(0.9rem,2.5vw,1.05rem)] leading-relaxed text-white/60">
          {HOME_COPY.hero.tagline}
        </p>
      </section>

      <section data-scroll-section className="px-[5%] py-24 sm:py-32">
        <p className="font-mono text-[0.7rem] tracking-[0.4em] text-[var(--violet-glow)] uppercase">
          {HOME_COPY.forge.sectionLabel}
        </p>
        <h2 className="neon-subtle mt-2 mb-12 text-[clamp(1.6rem,5vw,2.75rem)] font-bold tracking-wide">
          {HOME_COPY.forge.heading}
        </h2>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {HOME_COPY.forge.capabilities.map((cap) => (
            <GlassPanel key={cap.index} strong>
              <span className="font-mono text-xs text-[var(--violet-mid)]">{cap.index}</span>
              <p className="mt-2 font-mono text-[0.65rem] tracking-widest text-[var(--violet-glow)]">
                {cap.tag}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-wide">{cap.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{cap.body}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section data-scroll-section className="relative px-[5%] py-24 sm:py-36">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-[0.7rem] tracking-[0.4em] text-[var(--violet-mid)] uppercase">
            {HOME_COPY.depths.sectionLabel}
          </p>
          <h2 className="neon-subtle mt-2 text-[clamp(1.6rem,5vw,2.75rem)] font-bold tracking-wide">
            {HOME_COPY.depths.heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">
            {HOME_COPY.depths.intro}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {HOME_ARTIFACTS.map((artifact) => (
            <ProductCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      </section>

      <section
        data-scroll-section
        className="flex min-h-[60vh] flex-col items-center justify-center px-[5%] py-32 text-center"
      >
        <GlassPanel strong className="max-w-3xl text-center">
          <p className="font-mono text-[0.65rem] tracking-[0.5em] text-[var(--violet-mid)] uppercase">
            {HOME_COPY.cta.region}
          </p>
          <h2 className="neon-violet mt-4 text-[clamp(1.8rem,6vw,3rem)] font-black tracking-[0.12em]">
            {HOME_COPY.cta.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
            {HOME_COPY.cta.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="rounded-full border border-[var(--violet-mid)]/40 px-5 py-2 font-mono text-[0.7rem] tracking-widest text-[var(--violet-glow)]">
              {HOME_COPY.cta.explore}
            </span>
            <span className="rounded-full border border-white/10 px-5 py-2 font-mono text-[0.7rem] tracking-widest text-white/50">
              {HOME_COPY.cta.configurator}
            </span>
          </div>
        </GlassPanel>
      </section>

      <footer className="border-t border-white/5 px-[5%] py-10 text-center font-mono text-[0.65rem] tracking-widest text-white/30">
        {HOME_COPY.footer}
      </footer>
    </main>
  );
}
