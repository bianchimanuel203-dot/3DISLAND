/// <reference types="react" />

"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, PerspectiveCamera } from "three";
import * as THREE from "three";

type Props = {
  modelRef: React.RefObject<Group | null>;
};

export default function CameraSync({ modelRef }: Props): React.ReactElement | null {
  const { camera } = useThree();
  const hasFramed = useRef(false);

  useFrame(() => {
    // Si ya encuadramos o el modelo aún no está listo, salimos
    if (hasFramed.current) return;

    const object = modelRef.current;
    const persp = camera as PerspectiveCamera | null;

    // Robustez de carga
    if (!object || object.children.length === 0) return;
    if (!persp) return;

    object.updateMatrixWorld(true);

    // Forzar bounding boxes por malla antes de calcular el Box3 global
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeBoundingBox();
      }
    });

    const box = new THREE.Box3().setFromObject(object);

    // Si el modelo está cargando, la caja es vacía; esperamos al siguiente frame
    if (box.isEmpty()) return;

    const size = new THREE.Vector3();
    box.getSize(size);

    // Padding adicional al Box3 (obliga a alejar la cámara)
    // expandByScalar usa el radio en unidades del tamaño global
    const diagLen = size.length();
    box.expandByScalar(diagLen * 0.5);

    const paddedSize = new THREE.Vector3();
    box.getSize(paddedSize);

    const maxDim = Math.max(paddedSize.x, paddedSize.y, paddedSize.z);

    // Forzado de FOV para un look más pequeño/profesional
    persp.fov = 30;

    // Cálculo de la distancia para que el objeto quepa dentro del frustum
    // (suponemos centering en el origen por <Center>)
    const fovRad = THREE.MathUtils.degToRad(persp.fov);
    const distance = (maxDim / 2) / Math.tan(fovRad / 2);

    // “zoom out” agresivo (nuevo factor)
    const finalDistance = distance * 0.5;

    // DEBUG visual
    // eslint-disable-next-line no-console
    console.log("Distancia calculada:", finalDistance, "maxDim padded:", maxDim);

    // Posicionamos la cámara mirando al origen (0,0,0) donde está el modelo
    persp.position.set(0, maxDim * 0.1, finalDistance);
    persp.lookAt(0, 0, 0);
    persp.updateProjectionMatrix();

    // Solo encuadramos una vez
    hasFramed.current = true;
  });

  return null;
}