"use client";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Group, Mesh, PerspectiveCamera } from "three";
import * as THREE from "three";

type UseScrollExperienceOptions = {
  cameraRef: React.RefObject<PerspectiveCamera | null>;
  modelRef?: React.RefObject<Group | null>;
  laserRef?: React.RefObject<Mesh | null>;
  enabled?: boolean;
};

function collectMaterials(group: Group | null): THREE.Material[] {
  if (!group) return [];
  const materials: THREE.Material[] = [];
  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if ("opacity" in mat) {
          mat.transparent = true;
          materials.push(mat);
        }
      });
    }
  });
  return materials;
}

type ScrollDriver = ReturnType<typeof useScroll> & {
  scroll: MutableRefObject<number>;
};

/** Drives drei useScroll.offset from the page scroll-pin spacer (GSAP). */
export function useScrollGsapSync(enabled = true) {
  const scroll = useScroll() as ScrollDriver;
  const progressRef = useRef(0);

  useGSAP(
    () => {
      if (!enabled) return;

      const pinTarget = document.querySelector(".scroll-pin-spacer");
      if (!pinTarget) return;

      const trigger = ScrollTrigger.create({
        trigger: pinTarget,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      return () => trigger.kill();
    },
    { dependencies: [enabled] }
  );

  useFrame(() => {
    scroll.scroll.current = progressRef.current;
  });
}

export function useScrollExperience({
  cameraRef,
  modelRef,
  laserRef,
  enabled = true,
}: UseScrollExperienceOptions) {
  const scroll = useScroll();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useScrollGsapSync(enabled);

  useGSAP(
    () => {
      if (!enabled || !cameraRef.current) return;

      const camera = cameraRef.current;
      const model = modelRef?.current ?? null;
      const laser = laserRef?.current ?? null;
      const materials = collectMaterials(model);
      const fadeProxy = { value: 1 };

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 769px)",
          isMobile: "(max-width: 768px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(camera.position, { x: 0, y: 0.45, z: 2.45 });
            gsap.set(camera.rotation, { x: -0.06, y: 0, z: 0 });
            if (model) {
              gsap.set(model.rotation, { x: 0, y: 0.15, z: 0 });
              gsap.set(model.position, { x: 0, y: 0, z: 0 });
            }
            if (laser) gsap.set(laser.material, { opacity: 0 });
            return;
          }

          const pinTarget = document.querySelector(".scroll-pin-spacer");
          if (!pinTarget) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinTarget,
              start: "top top",
              end: "bottom bottom",
              scrub: isMobile ? 0.65 : 1,
              pin: false,
            },
          });

          // Hero (0–0.35): centered hero framing, dolly in slightly on scroll
          if (model) {
            tl.fromTo(
              model.rotation,
              { x: 0, y: 0, z: 0 },
              { y: isMobile ? 0.35 : 0.55, ease: "none" },
              0
            );
            tl.fromTo(
              model.position,
              { x: 0, y: 0, z: 0 },
              { x: isMobile ? -0.12 : -0.22, y: isMobile ? 0.02 : 0.05, z: 0, ease: "none" },
              0
            );
          }

          tl.fromTo(
            camera.position,
            { x: 0, y: isMobile ? 0.4 : 0.45, z: isMobile ? 2.75 : 2.55 },
            {
              x: 0,
              y: isMobile ? 0.36 : 0.4,
              z: isMobile ? 2.25 : 2.05,
              ease: "none",
            },
            0
          ).fromTo(
            camera.rotation,
            { x: isMobile ? -0.07 : -0.08, y: 0, z: 0 },
            {
              x: isMobile ? -0.09 : -0.1,
              y: isMobile ? 0.04 : 0.06,
              z: 0,
              ease: "none",
            },
            0
          );

          // Forge (0.35–0.65): slide printer right, side detail zoom
          tl.to(
            camera.position,
            {
              x: isMobile ? -0.95 : -1.35,
              y: isMobile ? 0.72 : 0.82,
              z: isMobile ? 2.35 : 2.05,
              ease: "none",
            },
            0.35
          ).to(
            camera.rotation,
            {
              x: isMobile ? 0.05 : 0.1,
              y: isMobile ? -0.42 : -0.58,
              z: 0,
              ease: "none",
            },
            0.35
          );

          if (model) {
            tl.to(
              model.rotation,
              {
                x: isMobile ? 0.1 : 0.16,
                y: isMobile ? -0.55 : -0.82,
                z: 0,
                ease: "none",
              },
              0.35
            ).to(
              model.position,
              {
                x: isMobile ? 1.05 : 1.45,
                y: isMobile ? -0.05 : 0.12,
                z: isMobile ? 0.05 : 0.12,
                ease: "none",
              },
              0.35
            );
          }

          if (laser) {
            tl.fromTo(
              laser.material,
              { opacity: 0 },
              { opacity: isMobile ? 0.7 : 0.95, ease: "none" },
              0.35
            ).to(laser.material, { opacity: 0, ease: "none" }, 0.68);
          }

          // Depths (0.65–1): pull back, rise, fade into fog
          if (model) {
            tl.to(
              model.position,
              {
                x: isMobile ? 0.45 : 0.65,
                y: isMobile ? 0.35 : 0.55,
                z: isMobile ? -0.1 : -0.2,
                ease: "none",
              },
              0.65
            ).to(
              model.rotation,
              {
                x: isMobile ? -0.04 : -0.1,
                y: isMobile ? -0.25 : -0.4,
                ease: "none",
              },
              0.65
            );
          }

          tl.to(
            camera.position,
            {
              x: isMobile ? 0.25 : 0.45,
              y: isMobile ? 1.15 : 1.35,
              z: isMobile ? 3.15 : 3.55,
              ease: "none",
            },
            0.65
          ).to(
            camera.rotation,
            {
              x: isMobile ? -0.12 : -0.16,
              y: isMobile ? 0.05 : 0.1,
              z: 0,
              ease: "none",
            },
            0.65
          );

          if (materials.length > 0) {
            tl.to(
              fadeProxy,
              {
                value: isMobile ? 0.25 : 0.14,
                ease: "none",
                onUpdate: () => {
                  materials.forEach((mat) => {
                    mat.opacity = fadeProxy.value;
                  });
                },
              },
              0.65
            );
          }

          timelineRef.current = tl;
        }
      );

      return () => {
        materials.forEach((mat) => {
          mat.opacity = 1;
        });
        mm.revert();
      };
    },
    { dependencies: [enabled, cameraRef, modelRef, laserRef] }
  );

  useFrame(() => {
    if (!enabled || !cameraRef.current) return;
    const camera = cameraRef.current;
    const forgePull = scroll.curve(0.35, 0.3, 0.05);
    camera.fov = THREE.MathUtils.lerp(40, 36, forgePull);
    camera.updateProjectionMatrix();
  });

  useEffect(() => {
    if (!enabled) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [enabled]);
}

export function useSectionAnimations(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled = true
) {
  useGSAP(
    () => {
      if (!enabled || !containerRef.current) return;

      const sections = containerRef.current.querySelectorAll("[data-scroll-section]");
      const cards = containerRef.current.querySelectorAll("[data-artifact-card]");

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([sections, cards], { opacity: 1, y: 0 });
      });

      mm.add("(min-width: 0px)", () => {
        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                end: "top 45%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cards[0]?.parentElement,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      return () => mm.revert();
    },
    { dependencies: [enabled, containerRef], scope: containerRef }
  );
}
