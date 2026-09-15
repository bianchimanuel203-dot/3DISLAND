"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function useShopAnimations(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled = true
) {
  useGSAP(
    () => {
      if (!enabled || !containerRef.current) return;

      const hero = containerRef.current.querySelector("[data-shop-hero]");
      const grid = containerRef.current.querySelector("[data-shop-grid]");
      const cards = containerRef.current.querySelectorAll("[data-shop-card]");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([hero, grid, cards], { opacity: 1, y: 0, scale: 1 });
      });

      mm.add("(min-width: 0px)", () => {
        if (hero) {
          gsap.fromTo(
            hero,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
            }
          );
        }

        if (grid) {
          gsap.fromTo(
            grid,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay: 0.15,
              ease: "power2.out",
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 48, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: grid,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { dependencies: [enabled, containerRef], scope: containerRef }
  );
}

export function useShopNavReveal(navRef: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!navRef.current) return;

      gsap.fromTo(
        navRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
    },
    { scope: navRef }
  );
}
