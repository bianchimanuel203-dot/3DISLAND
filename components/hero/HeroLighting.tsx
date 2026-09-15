"use client";

import { useLayoutEffect, useRef } from "react";
import type { Object3D, SpotLight } from "three";

const LIGHT_TARGET: [number, number, number] = [0, 0.75, 0];

export default function HeroLighting() {
  const lightTargetRef = useRef<Object3D>(null);
  const keyRef = useRef<SpotLight>(null);
  const leftRimRef = useRef<SpotLight>(null);
  const rightRimRef = useRef<SpotLight>(null);

  useLayoutEffect(() => {
    const target = lightTargetRef.current;
    if (!target) return;
    for (const light of [keyRef.current, leftRimRef.current, rightRimRef.current]) {
      if (light) light.target = target;
    }
  }, []);

  return (
    <>
      <object3D ref={lightTargetRef} position={LIGHT_TARGET} />
      <ambientLight intensity={0.2} />
      <spotLight
        ref={keyRef}
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={5}
        color="#ffffff"
        castShadow={false}
      />
      <spotLight
        ref={leftRimRef}
        position={[-5.5, 3.5, -6]}
        angle={0.45}
        penumbra={0.85}
        intensity={4}
        color="#A855F7"
        castShadow={false}
      />
      <spotLight
        ref={rightRimRef}
        position={[5.5, 3.5, -6]}
        angle={0.45}
        penumbra={0.85}
        intensity={4}
        color="#A855F7"
        castShadow={false}
      />
    </>
  );
}
