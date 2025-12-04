// EarthShader.js
import * as THREE from "three";

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
