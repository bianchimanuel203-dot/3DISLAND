"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useState } from "react";

type GengarBloomProps = {
  enabled?: boolean;
};

export default function GengarBloom({ enabled = true }: GengarBloomProps) {
  const [active, setActive] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setActive(false);
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setActive(!mobileQuery.matches && !motionQuery.matches);
    };

    sync();
    mobileQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      mobileQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, [enabled]);

  if (!active) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.48}
        luminanceThreshold={0.28}
        luminanceSmoothing={0.78}
        mipmapBlur
      />
    </EffectComposer>
  );
}
