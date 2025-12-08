import React, { useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { EarthShaderMaterial } from "./EarthShader";

export default function EarthMesh({ earthRef, sunRef, textureUrl, onLoad }) {

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      EarthShaderMaterial.uniforms.dayTexture.value = tex;
      onLoad?.();
    });
  }, [textureUrl, onLoad]);

  useFrame(() => {
    if (sunRef.current) {
      EarthShaderMaterial.uniforms.sunDirection.value
        .copy(sunRef.current.position)
        .normalize();
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[4.9, 64, 64]} />
      <primitive object={EarthShaderMaterial} attach="material" />
    </mesh>
  );
}
