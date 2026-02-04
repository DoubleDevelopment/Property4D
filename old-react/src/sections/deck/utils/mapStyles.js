/**
 * Map style configurations for DeckGL globe
 */

export const DARK_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#0a0a0f'
      }
    }
  ]
};

export const LIGHT_MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#f0f0f0'
      }
    }
  ]
};

// Color schemes for different property types
export const PROPERTY_COLORS = {
  residential: [255, 215, 0, 200],    // Gold
  commercial: [255, 140, 0, 200],     // Dark Orange
  industrial: [220, 20, 60, 200],     // Crimson
  land: [34, 139, 34, 200],           // Forest Green
  luxury: [138, 43, 226, 200]         // Blue Violet
};

// Arc color gradients
export const ARC_COLORS = {
  source: [255, 215, 0, 150],         // Golden
  target: [255, 140, 0, 150]          // Orange
};

// Heatmap color range (from low to high density)
export const HEATMAP_COLORS = [
  [255, 255, 178],  // Light yellow
  [254, 217, 118],  // Yellow
  [254, 178, 76],   // Orange
  [253, 141, 60],   // Dark orange
  [252, 78, 42],    // Red-orange
  [227, 26, 28]     // Red
];
