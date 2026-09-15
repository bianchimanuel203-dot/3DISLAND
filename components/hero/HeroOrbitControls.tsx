"use client";

import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type HeroOrbitControlsProps = {
  enabled?: boolean;
};

export default function HeroOrbitControls({ enabled = true }: HeroOrbitControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      target={[0, 0.08, 0]}
      enableZoom={false}
      enablePan={false}
      autoRotate={enabled}
      autoRotateSpeed={0.35}
      rotateSpeed={0.45}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 3.8}
      minAzimuthAngle={-0.65}
      maxAzimuthAngle={0.65}
    />
  );
}
