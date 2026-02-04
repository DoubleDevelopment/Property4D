// Globe3D.jsx — Unified importer for all modular components
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import DeckGL from "@deck.gl/react";
import { _GlobeView as GlobeView } from "@deck.gl/core";
import { ScatterplotLayer, BitmapLayer, TextLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";


// --- Modular local components (adjusted paths after moving globe into sections) ---
import EarthMesh from "../sections/globe/EarthMesh";
import Stars from "../sections/globe/Stars";
import SunLight from "../sections/globe/SunLight";
import EarthFollower from "../sections/globe/EarthFollower";
import CameraZoom from "../sections/globe/CameraZoom";
import LandTopo from "../sections/globe/LandTopo";


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

// -------------------- Main Globe3D Component --------------------
export default function Globe3D({ textureUrl = "/earth4k.jpg", className = "w-full h-[80vh] relative" }) {
  const earthRef = useRef();
  const sunRef = useRef();
  const [ready, setReady] = useState(false);

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

  // DeckGL layers
  const layers = useMemo(() => {
    if (!ready) return [];

    const z = viewState.zoom ?? 1;

    const base = new TileLayer({
      id: "osm-basemap",
      data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      minZoom: 0,
      maxZoom: 22,
      renderSubLayers: props => {
        const { bbox, data, tile } = props;
        if (!data || !bbox) return null; // <- check bbox
        const { west, south, east, north } = bbox;
        if ([west, south, east, north].some(v => v === undefined)) return null;

        return new BitmapLayer({
          id: `tile-bmp-${tile.x}-${tile.y}-${tile.z}`,
          bounds: [west, south, east, north],
          image: data
        });
      }

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
    });

    const labels = new TextLayer({
      id: "region-labels",
      data: labelPoints,
      pickable: false,
      getPosition: (d) => [Number(d.lon), Number(d.lat)],
      getText: (d) => d.name,
      getSize: 14 + z * 2,
      getColor: [255, 255, 255, 255],
      sizeUnits: "pixels",
      billboard: true,
    });

    return [base, cities, labels];
  }, [ready, viewState.zoom]);

  const handleViewStateChange = ({ viewState: vs }) => {
    if (!vs) return;
    setViewState((prev) => ({ ...prev, ...vs }));
  };

  return (
    <div className={className} style={{ position: "relative" }}>
      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 1 }}
        camera={{ position: [0, 0, 15], fov: 47 }}
      >
        <ambientLight intensity={3} />
        <Stars count={3000} />
        <SunLight sunRef={sunRef} />

        <EarthMesh
          earthRef={earthRef}
          textureUrl={textureUrl}
          sunRef={sunRef}
          onLoad={() => setReady(true)}
        />

        {ready && <LandTopo radius={5.02} />}  {/* placeholder */}

        <EarthFollower earthRef={earthRef} viewStateRef={viewStateRef} />
        <CameraZoom viewStateRef={viewStateRef} />
      </Canvas>

      {ready && (
        <DeckGL
          controller={true}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          layers={layers}
          views={[new GlobeView({ id: "globe" })]}
          _autoRender={true}
          parameters={{ depthTest: false, depthMask: false, clearColor: [0, 0, 0, 0] }}
          style={{ position: "absolute", inset: 0, zIndex: 2, width: "100%", height: "100%", background: "transparent" }}
        />
      )}
    </div>
  );
}
