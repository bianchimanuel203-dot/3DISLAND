"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export function useHeroShopNavigation(enabled = true) {
  const router = useRouter();
  const navigatingRef = useRef(false);
  const hasTriggeredRef = useRef(false);

  const navigateToShop = useCallback(() => {
    // Evita múltiples ejecuciones.
    if (navigatingRef.current || !enabled) return;

    navigatingRef.current = true;

    const root = document.querySelector(".experience-root");
    if (root) {
      gsap.to(root, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          // Hard navigate: limpia memoria/GPU mejor ante WebGL issues.
          window.location.href = "/shop";
          // router.push("/shop"); // (intencionalmente desactivado en modo hard navigate)
        },
      });
      return;
    }

    window.location.href = "/shop";
    // router.push("/shop"); // (intencionalmente desactivado)
  }, [enabled, router]);

  useGSAP(
    () => {
      if (!enabled) return;

      // Limpieza defensiva para evitar spam.
      hasTriggeredRef.current = false;

      const observer = ScrollTrigger.observe({
        type: "wheel,touch",
        tolerance: 30,
        onDown: () => {
          if (hasTriggeredRef.current) return;
          hasTriggeredRef.current = true;

          // Desactiva observación inmediatamente para eliminar spam.
          observer.kill();

          // Pequeño delay para permitir que el layout estabilice.
          setTimeout(() => {
            navigateToShop();
          }, 250);
        },
      });

      const sentinel = document.querySelector(".hero-scroll-sentinel");
      const scrollTrigger = sentinel
        ? ScrollTrigger.create({
            trigger: sentinel,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              if (hasTriggeredRef.current) return;
              if (self.direction === 1 && self.progress > 0.06) {
                hasTriggeredRef.current = true;
                navigateToShop();
              }
            },
          })
        : null;

      return () => {
        observer.kill();
        scrollTrigger?.kill();
      };
    },
    { dependencies: [enabled, navigateToShop] }
  );

  return { navigateToShop };
}

