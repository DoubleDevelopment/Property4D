// CameraZoomSync.jsx
import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

export default function CameraZoomSync({ viewStateRef }) {
  const { camera } = useThree();

  useFrame(() => {
    const vs = viewStateRef.current;
    if (!vs) return;

    const z = vs.zoom ?? 1;
    const min = 6.5;
    const max = 20;
    const nz = Math.max(0.5, Math.min(8.0, z));
    const t = (nz - 0.5) / (8 - 0.5);

    const target = max * (1 - t) + min * t;

    camera.position.lerp(new THREE.Vector3(0, 0, target), 0.08);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
