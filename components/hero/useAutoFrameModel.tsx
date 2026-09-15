"use client";

import { useEffect } from "react";
import * as THREE from "three";

type Args = {
  object: THREE.Object3D | null;
  camera: THREE.PerspectiveCamera | null;
};

export function useAutoFrameModel({ object, camera }: Args) {
  useEffect(() => {
    if (!object || !camera) return;

    // Asegurar matrices actuales
    object.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    // Pivot correction (centrar correctamente)
    object.position.sub(center);

    // Distancia por FOV
    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const half = maxDim / 2;
    const distance = half / Math.tan(fovRad / 2);

    const margin = 1.15;
    camera.position.set(0, maxDim * 0.12, distance * margin);

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [object, camera]);
}

