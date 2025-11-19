// Globe3D.jsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import DeckGL from "@deck.gl/react";
import { _GlobeView as GlobeView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

// Sample points
const samplePoints = [
    { lat: -33.9249, lon: 18.4241, size: 200 },
    { lat: 37.7749, lon: -122.4194, size: 300 },
    { lat: 51.5074, lon: -0.1278, size: 250 },
];

// Share GL context between R3F and Deck
function SharedGLBridge({ setGLRenderer, setSize }) {
    const { gl, size } = useThree();
    useEffect(() => {
        if (!gl) return;
        const prev = gl.autoClear;
        gl.autoClear = false;
        setGLRenderer(gl);
        setSize(size);
        return () => {
            gl.autoClear = prev;
        };
    }, [gl, size, setGLRenderer, setSize]);
    return null;
}

// Earth mesh
function EarthMesh({ radius = 5, textureUrl, onLoad }) {
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            textureUrl,
            (tex) => {
                tex.flipY = false;
                tex.needsUpdate = true;
                setTexture(tex);
                onLoad?.();
            },
            undefined,
            (err) => console.error("Texture load error:", err)
        );
    }, [textureUrl, onLoad]);

    if (!texture) return null;

    return (
        <mesh>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial map={texture} metalness={0.02} roughness={0.9} />
        </mesh>
    );
}

export default function Globe3D({
    textureUrl = "/earth.png",
    className = "w-full h-[80vh] relative",
}) {
    const deckRef = useRef(null);
    const [glRenderer, setGLRenderer] = useState(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [ready, setReady] = useState(false); // wait for texture + GL

    const [viewState, setViewState] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 0,
        bearing: 0,
        pitch: 0,
    });

    // Only create ScatterplotLayer when ready
    const layers = useMemo(() => {
        if (!ready || !glRenderer) return [];

        return [
            new ScatterplotLayer({
                id: "cities",
                data: samplePoints.filter(
                    (p) =>
                        typeof p.lat === "number" &&
                        !isNaN(p.lat) &&
                        typeof p.lon === "number" &&
                        !isNaN(p.lon)
                ),
                pickable: true,
                getPosition: (d) => [d.lon, d.lat],
                getFillColor: [255, 200, 0],
                getRadius: (d) => d.size || 50,
                radiusMinPixels: 2,
                radiusMaxPixels: 100,
                onClick: ({ object }) =>
                    object && alert(`Clicked: ${object.lat}, ${object.lon}`),
            }),
        ];
    }, [ready, glRenderer]);


    const handleViewStateChange = ({ viewState: vs }) => {
        setViewState((prev) =>
            JSON.stringify(prev) === JSON.stringify(vs) ? prev : vs
        );
    };


    return (
        <div className={className} style={{ position: "relative" }}>
            <Canvas
                style={{ position: "absolute", inset: 0, zIndex: 1 }}
                camera={{ position: [0, 0, 12], fov: 45 }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <EarthMesh
                    radius={5}
                    textureUrl={textureUrl}
                    onLoad={() => setReady(true)}
                />
                <SharedGLBridge setGLRenderer={setGLRenderer} setSize={setCanvasSize} />
            </Canvas>

            {ready && glRenderer && canvasSize.width > 0 && canvasSize.height > 0 && (
                <DeckGL
                    ref={deckRef}
                    gl={glRenderer.getContext()}
                    layers={layers}
                    views={[new GlobeView({ id: "globe" })]}
                    controller={{ globe: true }}
                    viewState={viewState}
                    onViewStateChange={handleViewStateChange}
                    _autoRender={true}
                    useDevicePixelRatio={false}
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
                        width: canvasSize.width,
                        height: canvasSize.height,
                    }}
                />
            )}
        </div>
    );
}
