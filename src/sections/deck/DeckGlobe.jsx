import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, ScatterplotLayer, ArcLayer as DeckArcLayer } from '@deck.gl/layers';
import { HexagonLayer as DeckHexagonLayer } from '@deck.gl/aggregation-layers';

// Import hooks
import { useGlobeData } from './hooks/useGlobeData';

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  minZoom: 0,
  maxZoom: 20,
  pitch: 45,
  bearing: 0
};

export default function DeckGlobe({ 
  properties = [],
  showArcs = true,
  showHeatmap = true,
  theme = 'dark', // 'dark' | 'light'
}) {
  const [isReady, setIsReady] = useState(false);
  
  // Custom hook for data
  const { propertyData, arcData, heatmapData } = useGlobeData(properties);

  // Ensure component is mounted before rendering DeckGL
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-amber-400 font-['Cinzel',serif]">Loading Globe...</div>
      </div>
    );
  }

  // Choose styled base map tiles based on theme
  const tileUrl =
    theme === 'light'
      ? 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      : 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

  // Base map layer (Earth texture)
  const baseMapLayer = new TileLayer({
    id: 'base-map',
    data: tileUrl,
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: props => {
      const {
        bbox: { west, south, east, north }
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north]
      });
    }
  });

  // Property markers layer
  const propertyLayer = new ScatterplotLayer({
    id: 'property-layer',
    data: propertyData,
    getPosition: d => d.coordinates,
    getRadius: 100000,
    getFillColor: theme === 'light' ? [218, 165, 32, 220] : [255, 215, 0, 220], // Golden variants
    getLineColor: [255, 255, 255, 255],
    lineWidthMinPixels: 2,
    radiusMinPixels: 5,
    radiusMaxPixels: 30,
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 120],
  });

  // Connection arcs layer
  const arcLayer = new DeckArcLayer({
    id: 'arc-layer',
    data: arcData,
    getSourcePosition: d => d.from,
    getTargetPosition: d => d.to,
    getSourceColor: theme === 'light' ? [218, 165, 32, 180] : [255, 215, 0, 180],
    getTargetColor: theme === 'light' ? [255, 140, 0, 180] : [255, 160, 80, 180],
    getWidth: 3,
    getHeight: 0.5,
    greatCircle: true,
    pickable: true
  });

  // Heatmap hexagon layer
  const hexagonLayer = new DeckHexagonLayer({
    id: 'hexagon-layer',
    data: heatmapData,
    getPosition: d => d.coordinates,
    radius: 100000,
    elevationScale: 1000,
    extruded: true,
    coverage: 0.8,
    colorRange:
      theme === 'light'
        ? [
            [255, 245, 204],
            [254, 227, 145],
            [254, 196, 79],
            [254, 153, 41],
            [236, 112, 20],
            [204, 76, 2],
          ]
        : [
            [255, 255, 178],
            [254, 217, 118],
            [254, 178, 76],
            [253, 141, 60],
            [252, 78, 42],
            [227, 26, 28],
          ],
    elevationRange: [0, 3000],
    pickable: true,
    autoHighlight: true
  });

  const layers = [
    baseMapLayer,
    propertyLayer,
    showArcs && arcLayer,
    showHeatmap && hexagonLayer
  ].filter(Boolean);

  return (
    <div className="relative w-full h-full">
      <DeckGL
        views={new MapView({ repeat: true })}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        parameters={{
          clearColor: theme === 'light' ? [0.96, 0.96, 0.98, 1] : [0.07, 0.07, 0.15, 1]
        }}
        style={{ width: '100%', height: '100%' }}
        useDevicePixels={false}
        getTooltip={({ object }) => {
          if (object && object.name) {
            return {
              html: `
                <div style="background: rgba(0,0,0,0.8); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,215,0,0.3);">
                  <div style="color: #FFD700; font-weight: bold; margin-bottom: 4px;">${object.name}</div>
                  <div style="color: #FFF; font-size: 12px;">Price: $${object.price?.toLocaleString() || 'N/A'}</div>
                  <div style="color: #AAA; font-size: 11px;">${object.city || 'Unknown'}, ${object.country || ''}</div>
                </div>
              `,
              style: {
                backgroundColor: 'transparent',
                fontSize: '0.8em'
              }
            };
          }
          return null;
        }}
      />
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white border border-amber-500/30">
        <h3 className="text-sm font-semibold mb-2 font-['Cinzel',serif] text-amber-400">Globe Controls</h3>
        <p className="text-xs">Drag to rotate • Scroll to zoom</p>
        <p className="text-xs mt-1 text-amber-500/70">{propertyData.length} Properties</p>
      </div>
    </div>
  );
}
