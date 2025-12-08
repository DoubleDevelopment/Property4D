import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Stars component
function Stars({ count = 2000 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  return (
    <points>
      <primitive object={geo} attach="geometry" />
      <pointsMaterial size={0.8} sizeAttenuation color="white" />
    </points>
  );
}

// Earth Mesh with shader
function EarthMesh({ textureUrl }) {
  const earthRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      if (materialRef.current) {
        materialRef.current.uniforms.dayTexture.value = tex;
      }
    });
  }, [textureUrl]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: null },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          vNormal = normalize(normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform vec3 sunDirection;
        varying vec3 vNormal;
        varying vec2 vUv;

        // Simple noise function for city lights
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vec4 texColor = texture2D(dayTexture, vUv);
          vec3 tex = texColor.rgb;
          
          // Better land detection: oceans are blue/dark, land is green/brown/light
          float oceanness = tex.b - max(tex.r, tex.g);
          float landMask = smoothstep(0.05, -0.05, oceanness);
          
          // Detect edges/borders in original texture (country/state borders)
          float dx = length(dFdx(tex)) * 100.0;
          float dy = length(dFdy(tex)) * 100.0;
          float edge = max(dx, dy);
          float borderLine = smoothstep(0.2, 0.5, edge);
          
          // Define colors
          vec3 oceanColor = vec3(1.0, 1.0, 1.0);           // Pure white for oceans
          vec3 landColor = vec3(1.0, 0.84, 0.0);           // Bright gold for land
          vec3 borderColor = vec3(0.5, 0.42, 0.0);         // Dark gold for borders
          
          // Mix between white oceans and golden land
          vec3 coloredTex = mix(oceanColor, landColor, landMask);
          
          // Add dark golden borders only on land areas
          coloredTex = mix(coloredTex, borderColor, borderLine * landMask * 0.6);
          
          // Day/night lighting
          float ndotl = dot(normalize(vNormal), normalize(sunDirection));
          float daylight = clamp(ndotl, 0.0, 1.0);
          float night = smoothstep(-0.4, 0.0, ndotl);
          
          // City lights on night side (only on land)
          vec2 cityCoord = vUv * 500.0; // Scale for city density
          float cityNoise = random(floor(cityCoord));
          float cityLight = step(0.92, cityNoise); // 8% of land has cities
          
          // Cities only appear on land and on night side
          float nightSide = smoothstep(0.2, -0.2, ndotl); // 1.0 on night, 0.0 on day
          vec3 cityGlow = vec3(1.0, 0.9, 0.6) * cityLight * landMask * nightSide * 2.0;
          
          // Night glow with golden tint
          vec3 nightGlow = coloredTex * vec3(1.6, 1.2, 0.9) * night;
          vec3 finalColor = mix(nightGlow * 0.4, coloredTex * (daylight + 0.2), daylight);
          
          // Add city lights
          finalColor += cityGlow;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, []);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
  });

  useEffect(() => {
    materialRef.current = shaderMaterial;
  }, [shaderMaterial]);

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

// Sun light
function SunLight({ speed = 1 }) {
  const sunRef = useRef();

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

// Golden backlight
function GoldenBacklight() {
  const lightRef = useRef();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(Date.now() * 0.001) * 0.3;
    }
  });

  return <pointLight ref={lightRef} position={[-3, 0, 0]} color="#FFD700" intensity={1.5} distance={100} />;
}

export default function SideGlobe() {
  return (
    <div className="absolute right-0 top-0 w-1/2 h-full" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [7, 0, 0], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <Stars count={3000} />
        <SunLight speed={1} />
        <GoldenBacklight />
        <EarthMesh textureUrl="/earth4k.jpg" />
      </Canvas>
    </div>
  );
}
