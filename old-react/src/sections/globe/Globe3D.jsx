// Globe3D.jsx — fixed: label alignment + DeckGL visibility + tile zoom
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import DeckGL from "@deck.gl/react";
import { _GlobeView as GlobeView } from "@deck.gl/core";
import { ScatterplotLayer, BitmapLayer, TextLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";

// -------------------- Sample data --------------------
const samplePoints = [
  { lat: -33.9249, lon: 18.4241, size: 200 },
  { lat: 37.7749, lon: -122.4194, size: 300 },
  { lat: 51.5074, lon: -0.1278, size: 250 },
];

const labelPoints = [
  { name: "Africa", lat: 6.6, lon: 20.0 },
  { name: "Europe", lat: 54.0, lon: 15.0 },
  { name: "Asia", lat: 34.0, lon: 100.0 },
  { name: "North America", lat: 45.0, lon: -100.0 },
  { name: "South America", lat: -15.0, lon: -60.0 },
  { name: "Australia", lat: -25.0, lon: 135.0 },
];

// -------------------- Shader materials (unchanged) --------------------
export const EarthShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    dayTexture: { value: null },
    sunDirection: { value: new THREE.Vector3(1, 0, 0) },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec2 vUv;

    void main() {
        vNormal = normalize(normal);
        vPos = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform vec3 sunDirection;

    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec2 vUv;

    void main() {
        vec3 tex = texture2D(dayTexture, vUv).rgb;
        float ndotl = dot(normalize(vNormal), normalize(sunDirection));
        float daylight = clamp(ndotl, 0.0, 1.0);
        float night = smoothstep(-0.4, 0.0, ndotl);
        vec3 nightGlow = tex * vec3(1.6, 1.2, 0.9) * night;
        vec3 finalColor = mix(nightGlow * 0.5, tex * daylight, daylight);
        gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
});

// -------------------- Earth Mesh --------------------
function EarthMesh({ earthRef, textureUrl, sunRef, onLoad }) {
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      EarthShaderMaterial.uniforms.dayTexture.value = tex;
      onLoad?.();
    });
  }, [textureUrl, onLoad]);

  useFrame(() => {
    if (!sunRef.current) return;
    EarthShaderMaterial.uniforms.sunDirection.value
      .copy(sunRef.current.position)
      .normalize();
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[4.9, 64, 64]} />
      <primitive object={EarthShaderMaterial} attach="material" />
    </mesh>
  );
}

// -------------------- Stars --------------------
function Stars({ count = 2000 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 2000;
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  return (
    <points>
      <primitive object={geo} attach="geometry" />
      <pointsMaterial size={0.8} sizeAttenuation />
    </points>
  );
}

// -------------------- Sun --------------------
function SunLight({ sunRef, speed = 1 }) {
  useFrame(() => {
    const t = performance.now() * 0.00005 * speed;
    const dist = 20;
    if (!sunRef.current) return;
    sunRef.current.position.set(
      Math.sin(t) * dist,
      Math.sin(t * 0.5) * dist * 0.3,
      Math.cos(t) * dist
    );
    sunRef.current.lookAt(0, 0, 0);
  });
  return <directionalLight ref={sunRef} intensity={2} />;
}

// -------------------- EarthFollower (fixed mapping) --------------------
// Important: correct mapping and small rotation offset to match DeckGL projection & your shader UV orientation.
function EarthFollower({ earthRef, viewStateRef, rotationOffsetDeg = 0 }) {
  const tmpEuler = new THREE.Euler(0, 0, 0, "YXZ");
  const q = new THREE.Quaternion();

  useFrame(() => {
    if (!earthRef.current) return;
    const vs = viewStateRef.current;
    if (!vs) return;

    // Map DeckGL viewState -> three.js sphere orientation.
    // After tests, this mapping aligns labels for most globe/UV conventions.
    // If your shader or texture is rotated differently, tweak rotationOffsetDeg.
    const lonRad = THREE.MathUtils.degToRad(vs.longitude || 0); // DeckGL longitude
    const latRad = THREE.MathUtils.degToRad(vs.latitude || 0); // DeckGL latitude
    const bearingRad = THREE.MathUtils.degToRad(vs.bearing || 0);

    // We want:
    // - Y axis rotation = +lon (so positive lon rotates globe east)
    // - X axis rotation = -lat (invert so north lifts toward camera)
    // - Z axis = -bearing (so bearing rotates labels correctly)
    const rotY = lonRad;
    const rotX = -latRad;
    const rotZ = -bearingRad;

    // rotation offset (in radians) in case your sphere UV is rotated
    const offset = THREE.MathUtils.degToRad(rotationOffsetDeg);

    tmpEuler.set(rotX, rotY + offset, rotZ);
    q.setFromEuler(tmpEuler);

    // smooth slerp
    earthRef.current.quaternion.slerp(q, 0.14);
  });

  return null;
}

// -------------------- CameraZoomSync --------------------
function CameraZoomSync({ viewStateRef }) {
  const { camera } = useThree();
  useFrame(() => {
    const vs = viewStateRef.current;
    if (!vs) return;
    const z = vs.zoom ?? 1;
    const min = 6.5;
    const max = 20;
    const nz = Math.max(0.5, Math.min(8.0, z));
    const t = (nz - 0.5) / (8.0 - 0.5);
    const target = max * (1 - t) + min * t;
    camera.position.lerp(new THREE.Vector3(0, 0, target), 0.08);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// -------------------- Main Component --------------------
export default function Globe3D({
  textureUrl = "/earth4k.jpg",
  className = "w-full h-[80vh] relative",
}) {
  const earthRef = useRef();
  const sunRef = useRef();
  const [ready, setReady] = useState(false);

  // DeckGL authoritative viewState (start centered on Cape Town)
  const [viewState, setViewState] = useState({
    longitude: 18.4241,
    latitude: -33.9249,
    zoom: 1.4,
    bearing: 0,
    pitch: 30,
  });

  const viewStateRef = useRef(viewState);
  useEffect(() => {
    viewStateRef.current = viewState;
  }, [viewState]);

  // NOTE: removed aggressive fading of threejs canvas to avoid "darkness" on zoom
  // You can re-enable a gentle fade if you want, but it confused debugging.

  // DeckGL layers (TileLayer maxZoom increased)
  const layers = useMemo(() => {
    if (!ready) return [];

    const z = viewState.zoom ?? 1;
    const base = new TileLayer({
      id: "osm-basemap",
      data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      minZoom: 0,
      // increase maxZoom to allow deeper tile detail; some tile servers top at ~19-20
      maxZoom: 22,
      tileSize: 256,
      renderSubLayers: (props) => {
        const {
          boundingBox: [[minLng, minLat], [maxLng, maxLat]],
          data,
          id,
        } = props;
        return new BitmapLayer(props, {
          id: `${id}-bitmap`,
          image: data,
          bounds: [minLng, minLat, maxLng, maxLat],
        });
      },
    });

    const cities = new ScatterplotLayer({
      id: "cities",
      data: samplePoints,
      pickable: true,
      getPosition: (d) => [Number(d.lon), Number(d.lat)],
      getFillColor: [255, 200, 0, 200],
      getRadius: (d) => Number(d.size) || 50,
      radiusMinPixels: 2,
      radiusMaxPixels: 100,
      onClick: ({ object }) => object && alert(`Clicked: ${object.lat}, ${object.lon}`),
    });

    const labels = new TextLayer({
      id: "region-labels",
      data: labelPoints,
      pickable: false,
      // NOTE: deckgl TextLayer expects [lng, lat]
      getPosition: (d) => [Number(d.lon), Number(d.lat)],
      getText: (d) => d.name,
      getSize: 14 + (z || 0) * 2,
      getColor: [255, 255, 255, 255],
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      sizeUnits: "pixels",
      billboard: true,
    });

    return [base, cities, labels];
  }, [ready, viewState.zoom]);

  // DeckGL authoritative onViewStateChange
  const handleViewStateChange = ({ viewState: vs }) => {
    if (!vs) return;
    setViewState((prev) => {
      if (
        prev.longitude === vs.longitude &&
        prev.latitude === vs.latitude &&
        prev.zoom === vs.zoom &&
        prev.bearing === vs.bearing &&
        prev.pitch === vs.pitch
      ) {
        return prev;
      }
      return { ...prev, ...vs };
    });
  };

  useEffect(() => {
    setViewState((v) => ({ ...v, zoom: 1.4 }));
  }, []);

  return (
    <div className={className} style={{ position: "relative" }}>
      {/* Three.js visuals (behind deck) */}
      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          // no fade: keep visuals stable while deck renders on top
          opacity: 1,
        }}
        camera={{ position: [0, 0, 15], fov: 47 }}
      >
        <ambientLight intensity={0.9} />
        <Stars count={3000} />
        <SunLight sunRef={sunRef} />
        <EarthMesh
          earthRef={earthRef}
          textureUrl={textureUrl}
          sunRef={sunRef}
          onLoad={() => setReady(true)}
        />

        {/* EarthFollower: rotationOffsetDeg tweak if labels still misalign */}
        <EarthFollower earthRef={earthRef} viewStateRef={viewStateRef} rotationOffsetDeg={0} />

        <CameraZoomSync viewStateRef={viewStateRef} />
      </Canvas>

      {/* DeckGL overlay — authoritative map layers rendered on transparent globe */}
      {ready && (
        <DeckGL
          controller={true}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          layers={layers}
          views={[new GlobeView({ id: "globe" })]}
          _autoRender={true}
          useDevicePixelRatio={true}
          parameters={{
            depthTest: false,
            depthMask: false,
            clearColor: [0, 0, 0, 0],
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "auto",
            background: "transparent",
            width: "100%",
            height: "100%",
            // ensure DeckGL is fully visible
            opacity: 1,
          }}
        />
      )}
    </div>
  );
}
