import React, { useState, useEffect, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, ScatterplotLayer, ArcLayer as DeckArcLayer, ColumnLayer, GeoJsonLayer } from '@deck.gl/layers';

// Import hooks
import { useGlobeData } from './hooks/useGlobeData';

// Generate synthetic building data around major cities for a 3D world effect
function generateFakeBuildings() {
  // Same major cities list conceptually used in the SideGlobe shader
  const cities = [
    { name: 'New York', lat: 40.7, lon: -74.0, weight: 1.2 },
    { name: 'Los Angeles', lat: 34.0, lon: -118.2, weight: 1.0 },
    { name: 'London', lat: 51.5, lon: -0.1, weight: 1.0 },
    { name: 'Paris', lat: 48.8, lon: 2.3, weight: 0.9 },
    { name: 'Tokyo', lat: 35.6, lon: 139.7, weight: 1.3 },
    { name: 'Shanghai', lat: 31.2, lon: 121.5, weight: 1.1 },
    { name: 'Hong Kong', lat: 22.3, lon: 114.2, weight: 1.1 },
    { name: 'Singapore', lat: 1.3, lon: 103.8, weight: 0.9 },
    { name: 'Mexico City', lat: 19.4, lon: -99.1, weight: 0.8 },
    { name: 'São Paulo', lat: -23.5, lon: -46.6, weight: 0.8 },
    { name: 'Moscow', lat: 55.7, lon: 37.6, weight: 1.0 },
    { name: 'Delhi', lat: 28.6, lon: 77.2, weight: 0.9 },
    { name: 'Dubai', lat: 25.2, lon: 55.3, weight: 1.2 },
    { name: 'Cape Town', lat: -33.9, lon: 18.4, weight: 0.7 },
    { name: 'Seoul', lat: 37.5, lon: 127.0, weight: 1.0 },
    { name: 'Beijing', lat: 39.9, lon: 116.4, weight: 1.1 },
  ];

  const buildings = [];

  cities.forEach((city) => {
    const count = Math.round(40 * city.weight);

    for (let i = 0; i < count; i++) {
      // Small random offset around each city (in degrees)
      const dLat = (Math.random() - 0.5) * 0.4; // ~±0.2°
      const dLon = (Math.random() - 0.5) * 0.4;

      const longitude = city.lon + dLon;
      const latitude = city.lat + dLat;

      // Height in meters (fake): base 50–300, scaled by city weight
      const baseHeight = 50 + Math.random() * 250;
      const height = baseHeight * city.weight;

      buildings.push({
        coordinates: [longitude, latitude],
        height,
        city: city.name,
      });
    }
  });

  return buildings;
}

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
  showHeatmap = false, // Disabled - hex layer removed
  theme = 'dark', // 'dark' | 'light'
}) {
  const [isReady, setIsReady] = useState(false);
  
  // Custom hook for data
  const { propertyData, arcData, heatmapData } = useGlobeData(properties);

   // Synthetic 3D building data for visual world simulation
   const buildingData = useMemo(() => generateFakeBuildings(), []);

  // Generate synthetic country/region polygons with survey data
  const geoJsonData = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      // Example: USA with segmented regions
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-125, 50], [-66, 50], [-66, 25], [-125, 25], [-125, 50]
          ]]
        },
        properties: {
          name: 'United States',
          region: 'North America',
          security: 85,
          hospitals: 92,
          infrastructure: 88,
          marketScore: 90,
          population: 331000000
        }
      },
      // Example: UK with segmented regions
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-10, 60], [2, 60], [2, 50], [-10, 50], [-10, 60]
          ]]
        },
        properties: {
          name: 'United Kingdom',
          region: 'Europe',
          security: 90,
          hospitals: 95,
          infrastructure: 93,
          marketScore: 88,
          population: 67000000
        }
      },
      // Example: Japan with segmented regions
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [129, 46], [146, 46], [146, 30], [129, 30], [129, 46]
          ]]
        },
        properties: {
          name: 'Japan',
          region: 'Asia',
          security: 92,
          hospitals: 94,
          infrastructure: 96,
          marketScore: 85,
          population: 125000000
        }
      },
      // Example: Brazil with segmented regions
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-74, 5], [-35, 5], [-35, -34], [-74, -34], [-74, 5]
          ]]
        },
        properties: {
          name: 'Brazil',
          region: 'South America',
          security: 65,
          hospitals: 70,
          infrastructure: 68,
          marketScore: 72,
          population: 214000000
        }
      },
      // Example: South Africa with segmented regions
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [18, -22], [33, -22], [33, -35], [18, -35], [18, -22]
          ]]
        },
        properties: {
          name: 'South Africa',
          region: 'Africa',
          security: 55,
          hospitals: 60,
          infrastructure: 58,
          marketScore: 62,
          population: 59000000
        }
      },
      // Example: Australia with segmented regions
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [113, -10], [154, -10], [154, -44], [113, -44], [113, -10]
          ]]
        },
        properties: {
          name: 'Australia',
          region: 'Oceania',
          security: 88,
          hospitals: 90,
          infrastructure: 87,
          marketScore: 83,
          population: 26000000
        }
      }
    ]
  }), []);

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

  // 3D building columns layer (synthetic skyline around major cities)
  const buildingLayer = new ColumnLayer({
    id: 'building-layer',
    data: buildingData,
    getPosition: d => d.coordinates,
    getElevation: d => d.height,
    elevationScale: 5,
    radius: 800, // meters
    extruded: true,
    pickable: true,
    getFillColor:
      theme === 'light'
        ? [230, 190, 80, 220]   // softer gold in light mode
        : [255, 215, 0, 230],   // bright gold in dark mode
    getLineColor: [255, 255, 255, 120],
    lineWidthMinPixels: 1,
  });

  // Country/region polygons with survey data
  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: false,
    lineWidthMinPixels: 1,
    getFillColor: d => {
      // Color based on market score (0-100)
      const score = d.properties.marketScore;
      return theme === 'light'
        ? [255 - score * 1.5, 215 - score * 0.8, 100 - score * 0.3, 180] // Light mode gradient
        : [255 - score * 2, 215 - score * 1.2, 50, 200]; // Dark mode gradient
    },
    getLineColor: theme === 'light' ? [100, 100, 100, 200] : [255, 215, 0, 150],
    getLineWidth: 1,
  });

  const layers = [
    baseMapLayer,
    geoJsonLayer,
    propertyLayer,
    buildingLayer,
    showArcs && arcLayer,
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
            // Handle property tooltips
            if (object.price !== undefined) {
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
            // Handle country/region tooltips
            if (object.properties && object.properties.name) {
              const props = object.properties;
              return {
                html: `
                  <div style="background: rgba(0,0,0,0.9); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,215,0,0.4); min-width: 200px;">
                    <div style="color: #FFD700; font-weight: bold; margin-bottom: 8px; font-size: 14px;">${props.name}</div>
                    <div style="color: #AAA; font-size: 10px; margin-bottom: 6px;">${props.region}</div>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px; font-size: 11px;">
                      <span style="color: #888;">Security:</span><span style="color: ${props.security >= 80 ? '#4ADE80' : props.security >= 60 ? '#FCD34D' : '#F87171'}; font-weight: bold;">${props.security}%</span>
                      <span style="color: #888;">Hospitals:</span><span style="color: ${props.hospitals >= 80 ? '#4ADE80' : props.hospitals >= 60 ? '#FCD34D' : '#F87171'}; font-weight: bold;">${props.hospitals}%</span>
                      <span style="color: #888;">Infrastructure:</span><span style="color: ${props.infrastructure >= 80 ? '#4ADE80' : props.infrastructure >= 60 ? '#FCD34D' : '#F87171'}; font-weight: bold;">${props.infrastructure}%</span>
                      <span style="color: #888;">Market Score:</span><span style="color: ${props.marketScore >= 80 ? '#4ADE80' : props.marketScore >= 60 ? '#FCD34D' : '#F87171'}; font-weight: bold;">${props.marketScore}%</span>
                      <span style="color: #888;">Population:</span><span style="color: #FFF;">${(props.population / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                `,
                style: {
                  backgroundColor: 'transparent',
                  fontSize: '0.8em'
                }
              };
            }
          }
          return null;
        }}
      />
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white border border-amber-500/30">
        <h3 className="text-sm font-semibold mb-2 font-['Cinzel',serif] text-amber-400">Survey Map</h3>
        <p className="text-xs">Drag to rotate • Scroll to zoom</p>
        <p className="text-xs mt-1 text-amber-500/70">{propertyData.length} Properties</p>
        <p className="text-xs mt-1 text-green-400/70">{geoJsonData.features.length} Regions</p>
      </div>
    </div>
  );
}
