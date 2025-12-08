// SunLight.jsx
import React from "react";
import { useFrame } from "@react-three/fiber";

export default function SunLight({ sunRef, speed = 1 }) {
  useFrame(() => {
    const t = performance.now() * 0.00005 * speed;
    const dist = 20;

    if (sunRef.current) {
      sunRef.current.position.set(
        Math.sin(t) * dist,
        Math.sin(t * 0.5) * dist * 0.3,
        Math.cos(t) * dist
      );
      sunRef.current.lookAt(0, 0, 0);
    }
  });

  return <directionalLight ref={sunRef} intensity={2} />;
}
