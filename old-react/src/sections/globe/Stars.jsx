// Stars.jsx
import React, { useMemo } from "react";
import * as THREE from "three";

export default function Stars({ count = 2000 }) {
  const geo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);

  return (
    <points>
      <primitive object={geo} attach="geometry" />
      <pointsMaterial size={0.8} sizeAttenuation />
    </points>
  );
}
