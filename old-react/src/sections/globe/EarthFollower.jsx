import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function EarthFollower({ earthRef, viewStateRef, rotationOffsetDeg = 0 }) {
  const tmpEuler = useRef(new THREE.Euler(0, 0, 0, "YXZ")).current;
  const q = useRef(new THREE.Quaternion()).current;

  useFrame(() => {
    if (!earthRef?.current) return;

    const vs = viewStateRef?.current;
    if (!vs) return;

    const lonRad = THREE.MathUtils.degToRad(vs.longitude || 0);
    const latRad = THREE.MathUtils.degToRad(vs.latitude || 0);
    const bearingRad = THREE.MathUtils.degToRad(vs.bearing || 0);

    const offset = THREE.MathUtils.degToRad(rotationOffsetDeg);

    tmpEuler.set(
      -latRad,
      lonRad + offset,
      -bearingRad
    );

    q.setFromEuler(tmpEuler);
    earthRef.current.quaternion.slerp(q, 0.14);
  });

  return null;
}
