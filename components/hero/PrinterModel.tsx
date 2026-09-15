"use client";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  onReady?: () => void;
  onGlbLoaded?: () => void;
  onPrinterClick?: () => void;
  onPrinterPointerOver?: () => void;
  onPrinterPointerOut?: () => void;
};

export default function PrinterModel({
  onReady,
  onGlbLoaded,
  onPrinterClick,
  onPrinterPointerOver,
  onPrinterPointerOut,
}: Props) {
  const { scene } = useGLTF('/models/tu-modelo/scene.gltf');

  useEffect(() => {
    scene.traverse((child) => {
      const c = child as any;
      if (c.isMesh) {
        const mat = c.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.envMapIntensity = 0.6;
          mat.needsUpdate = true;
        }
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
    onGlbLoaded?.();
    onReady?.();
  }, [scene, onReady, onGlbLoaded]);

  return (
    <primitive
      object={scene}
      scale={1.4}
      position={[0, -0.6, 0]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onPrinterClick?.();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onPrinterPointerOver?.();
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "";
        onPrinterPointerOut?.();
      }}
    />
  );
}

useGLTF.preload('/models/tu-modelo/scene.gltf');