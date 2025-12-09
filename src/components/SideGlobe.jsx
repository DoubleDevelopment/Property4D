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

// Cloud layer
function Clouds() {
  const cloudsRef = useRef();
  
  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for(int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          // Animated clouds
          vec2 cloudCoord = vUv * 8.0 + vec2(time * 0.02, 0.0);
          float clouds = fbm(cloudCoord);
          
          // Make clouds more visible but still wispy
          clouds = smoothstep(0.45, 0.65, clouds);
          
          // Fade at edges
          float edge = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          clouds *= smoothstep(0.0, 0.5, edge);
          
          // More visible clouds
          gl_FragColor = vec4(1.0, 1.0, 1.0, clouds * 0.3);
        }
      `
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0003;
      if (cloudMaterial.uniforms.time) {
        cloudMaterial.uniforms.time.value = clock.getElapsedTime();
      }
    }
  });
  
  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[4.05, 64, 64]} />
      <primitive object={cloudMaterial} attach="material" />
    </mesh>
  );
}

// Earth Mesh with shader
function EarthMesh({ textureUrl, sunRef }) {
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
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        #ifdef GL_ES
        precision highp float;
        #endif
        
        uniform sampler2D dayTexture;
        uniform vec3 sunDirection;
        uniform float time;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        // Improved noise functions
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        // Fractal noise for ocean waves
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for(int i = 0; i < 4; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        // Major city locations (lat, lon) - concentrated clusters
        bool isNearMajorCity(vec2 uv) {
          float lat = (uv.y - 0.5) * 180.0;
          float lon = (uv.x - 0.5) * 360.0;
          
          vec2 cities[20];
          cities[0] = vec2(40.7, -74.0);   // New York
          cities[1] = vec2(34.0, -118.2);  // Los Angeles
          cities[2] = vec2(51.5, -0.1);    // London
          cities[3] = vec2(48.8, 2.3);     // Paris
          cities[4] = vec2(35.6, 139.7);   // Tokyo
          cities[5] = vec2(31.2, 121.5);   // Shanghai
          cities[6] = vec2(22.3, 114.2);   // Hong Kong
          cities[7] = vec2(1.3, 103.8);    // Singapore
          cities[8] = vec2(19.4, -99.1);   // Mexico City
          cities[9] = vec2(-23.5, -46.6);  // São Paulo
          cities[10] = vec2(55.7, 37.6);   // Moscow
          cities[11] = vec2(28.6, 77.2);   // Delhi
          cities[12] = vec2(25.2, 55.3);   // Dubai
          cities[13] = vec2(-33.9, 18.4);  // Cape Town
          cities[14] = vec2(37.5, 127.0);  // Seoul
          cities[15] = vec2(39.9, 116.4);  // Beijing
          cities[16] = vec2(52.5, 13.4);   // Berlin
          cities[17] = vec2(41.9, 12.5);   // Rome
          cities[18] = vec2(-33.8, 151.2); // Sydney
          cities[19] = vec2(13.7, 100.5);  // Bangkok
          
          float minDist = 1000.0;
          for(int i = 0; i < 20; i++) {
            float dist = distance(vec2(lat, lon), cities[i]);
            minDist = min(minDist, dist);
          }
          
          return minDist < 15.0;
        }

        void main() {
          vec4 texColor = texture2D(dayTexture, vUv);
          vec3 tex = texColor.rgb;
          
          // Land detection - oceans are darker (blue), land is brighter
          // Invert the logic: high values = land, low values = ocean
          float landMask = smoothstep(0.15, 0.25, tex.g); // Green channel works best
          
          // Edge detection for borders
          float dx = length(dFdx(tex)) * 100.0;
          float dy = length(dFdy(tex)) * 100.0;
          float edge = max(dx, dy);
          float borderLine = smoothstep(0.2, 0.5, edge);
          
          // Animated ocean waves
          vec2 waveCoord = vUv * 50.0 + time * 0.05;
          float waves = fbm(waveCoord) * 0.5 + 0.5;
          float waveDetail = fbm(waveCoord * 3.0) * 0.3;
          
          // Ocean colors with depth variation - LESS WHITE, MORE BLUE
          vec3 deepOcean = vec3(0.65, 0.75, 0.88);    // Blue ocean
          vec3 shallowOcean = vec3(0.75, 0.82, 0.92); // Light blue
          vec3 oceanColor = mix(deepOcean, shallowOcean, waves + waveDetail);
          
          // Enhanced land colors with texture variation
          vec3 landBase = vec3(1.0, 1.0, 0.0);       // Bright gold
          vec3 landHighlight = vec3(1.0, 0.9, 0.3);   // Lighter gold
          float landVariation = fbm(vUv * 100.0) * 0.5 + 0.5;
          vec3 landColor = mix(landBase, landHighlight, landVariation);
          
          vec3 borderColor = vec3(0.5, 0.42, 0.0);    // Dark gold borders
          
          vec3 coloredTex = mix(oceanColor, landColor, landMask);
          coloredTex = mix(coloredTex, borderColor, borderLine * landMask * 0.6);
          
          // Day/night lighting - PROPER SYNC
          vec3 sunDir = normalize(sunDirection);
          float ndotl = dot(normalize(vNormal), sunDir);
          float daylight = clamp(ndotl * 0.8 + 0.3, 0.0, 1.0);
          
          // Night side calculation - FIXED for proper sync
          float nightSide = smoothstep(0.1, -0.2, ndotl); // 1.0 when facing away from sun
          
          // Ocean specular highlights (sun reflection on water)
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 reflectDir = reflect(-sunDir, normalize(vNormal));
          float specular = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
          vec3 oceanSpecular = vec3(1.0, 1.0, 1.0) * specular * (1.0 - landMask) * daylight * 0.8;
          
          // City lights - concentrated in major cities - ONLY ON NIGHT SIDE
          vec2 cityCoord = vUv * 300.0;
          float cityNoise = noise(cityCoord);
          float cityDetail = noise(cityCoord * 3.0);
          
          float nearCity = isNearMajorCity(vUv) ? 1.0 : 0.0;
          
          float cityLight = step(0.85, cityNoise) * step(0.7, cityDetail) * nearCity;
          cityLight += step(0.92, cityNoise) * nearCity * 0.5;
          
          float pulse = 0.8 + sin(time * 2.0 + cityNoise * 10.0) * 0.2;
          
          // City lights ONLY appear on night side AND on land
          vec3 cityGlow = vec3(1.0, 0.85, 0.5) * cityLight * landMask * nightSide * pulse * 3.5;
          
          // Enhanced night glow
          vec3 nightGlow = coloredTex * vec3(1.4, 1.1, 0.8) * nightSide * 0.8;
          
          // Final color with brighter base
          vec3 finalColor = mix(nightGlow, coloredTex * daylight, daylight * 0.7);
          
          // Add city lights and ocean specular
          finalColor += cityGlow + oceanSpecular;
          
          // Subtle rim lighting for golden backlight effect
          float rimIntensity = 1.0 - max(0.0, dot(vNormal, viewDir));
          rimIntensity = pow(rimIntensity, 2.5);
          
          // Golden rim from the left side (where backlight is)
          vec3 backlightDir = normalize(vec3(-1.0, 0.0, 0.0));
          float backlightRim = max(0.0, dot(vNormal, backlightDir));
          backlightRim = pow(backlightRim, 4.0);
          
          // Subtle golden rim glow
          vec3 rimColor = vec3(1.0, 0.85, 0.4) * rimIntensity * 0.15;
          vec3 backlightGlow = vec3(1.0, 0.84, 0.0) * backlightRim * 0.6;
          
          finalColor += rimColor + backlightGlow;
          
          // Atmospheric glow on ocean edges
          float atmosphere = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
          finalColor += vec3(0.6, 0.7, 1.0) * atmosphere * 0.15 * (1.0 - landMask);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, []);

  useFrame(({ clock, camera }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
    if (materialRef.current && sunRef.current) {
      // Sync shader sun direction with actual light
      const sunDir = sunRef.current.position.clone().normalize();
      materialRef.current.uniforms.sunDirection.value.copy(sunDir);
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      
      // Update camera position for rim lighting
      if (materialRef.current.uniforms.cameraPosition) {
        materialRef.current.uniforms.cameraPosition = { value: camera.position };
      }
    }
  });

  useEffect(() => {
    materialRef.current = shaderMaterial;
  }, [shaderMaterial]);

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[4, 128, 128]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

// Sun light
function SunLight({ speed = 1, sunRef }) {
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
  return <directionalLight ref={sunRef} intensity={4} />;
}

// Golden backlight with glow sphere
function GoldenBacklight() {
  const lightRef = useRef();
  const glowRef = useRef();

  useFrame(() => {
    if (lightRef.current) {
      const intensity = 1.2 + Math.sin(Date.now() * 0.001) * 0.3;
      lightRef.current.intensity = intensity;
    }
    if (glowRef.current) {
      const scale = 1.0 + Math.sin(Date.now() * 0.0008) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <>
      {/* Main golden backlight - positioned behind globe */}
      <pointLight 
        ref={lightRef} 
        position={[-6, 0, 0]} 
        color="#FFD700" 
        intensity={1.2} 
        distance={25} 
      />
      
      {/* Subtle glowing sphere for visual effect */}
      <mesh ref={glowRef} position={[6, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.15}
        />
      </mesh>
    </>
  );
}

export default function SideGlobe() {
  const sunRef = useRef();
  
  return (
    <div className="absolute right-0 top-0 w-1/2 h-full" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [7, 0, 0], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <Stars count={3000} />
        <SunLight speed={1} sunRef={sunRef} />
        
        {/* Single clean backlight for rim effect */}
        <GoldenBacklight />
        
        <EarthMesh textureUrl="/earth.png" sunRef={sunRef} />
        <Clouds />
      </Canvas>
    </div>
  );
}
