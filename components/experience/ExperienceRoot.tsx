"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ExperienceRootProps = {
  children: ReactNode;
  active?: boolean;
};

export default function ExperienceRoot({
  children,
  active = true,
}: ExperienceRootProps) {
  useEffect(() => {
    if (!active) return;

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [active]);

  return <div className="experience-root min-h-screen bg-[#05050A]">{children}</div>;
}
