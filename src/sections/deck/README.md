# DeckGL 3D Globe Component

A complete DeckGL-based 3D globe visualization system for displaying real estate properties globally.

## 📁 Folder Structure

```
deck/
├── DeckGlobe.jsx           # Main globe component
├── index.js                # Barrel export file
├── README.md               # This file
│
├── layers/                 # Custom DeckGL layers
│   ├── PropertyLayer.js    # Property markers with tooltips
│   ├── ArcLayer.js         # Connection arcs between properties
│   └── HexagonLayer.js     # Heatmap hexagon aggregation
│
├── hooks/                  # Custom React hooks
│   ├── useGlobeData.js     # Data processing and management
│   └── useGlobeControls.js # Globe controls and auto-rotation
│
├── utils/                  # Utility functions
│   ├── mapStyles.js        # Map styling configurations
│   └── coordinates.js      # Coordinate calculations
│
└── data/                   # Sample and mock data
    └── sampleProperties.js # Sample property data for testing
```

## 🚀 Usage

### Basic Usage

```jsx
import { DeckGlobe, sampleProperties } from './sections/deck';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DeckGlobe 
        properties={sampleProperties}
        showArcs={true}
        showHeatmap={true}
        autoRotate={true}
      />
    </div>
  );
}
```

### With Custom Data

```jsx
const myProperties = [
  {
    id: 1,
    name: 'Property Name',
    longitude: -74.006,
    latitude: 40.7128,
    price: 1000000,
    city: 'New York',
    type: 'residential'
  },
  // ... more properties
];

<DeckGlobe properties={myProperties} />
```

## 🎨 Features

### Layers

1. **PropertyLayer** - Golden markers for each property
   - Hover tooltips with property details
   - Auto-highlighting on hover
   - Pulsing animation effect

2. **ArcLayer** - Animated arcs connecting related properties
   - Golden to orange gradient
   - Great circle paths
   - Configurable connections

3. **HexagonLayer** - Heatmap showing property density
   - 3D extruded hexagons
   - Color-coded by density
   - Aggregated property data

### Controls

- **Drag** - Rotate the globe
- **Scroll** - Zoom in/out
- **Auto-rotate** - Automatic rotation (pauses on interaction)

## 🔧 Customization

### Property Types

Supported property types with color coding:
- `residential` - Gold
- `commercial` - Dark Orange
- `industrial` - Crimson
- `land` - Forest Green
- `luxury` - Blue Violet

### View Configuration

Modify `INITIAL_VIEW_STATE` in `DeckGlobe.jsx`:

```javascript
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 0,
  pitch: 0,
  bearing: 0
};
```

## 📦 Required Dependencies

```bash
npm install @deck.gl/react @deck.gl/core @deck.gl/layers @deck.gl/geo-layers @deck.gl/aggregation-layers
```

## 🎯 Props

### DeckGlobe Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `properties` | Array | `[]` | Array of property objects |
| `showArcs` | Boolean | `true` | Show connection arcs |
| `showHeatmap` | Boolean | `true` | Show density heatmap |
| `autoRotate` | Boolean | `true` | Enable auto-rotation |

### Property Object Structure

```javascript
{
  id: number,
  name: string,
  longitude: number,
  latitude: number,
  price: number,
  city: string,
  country: string,
  type: 'residential' | 'commercial' | 'industrial' | 'land' | 'luxury'
}
```

## 🛠️ Utilities

### Coordinate Utilities

```javascript
import { calculateDistance, getCenterPoint } from './utils/coordinates';

const distance = calculateDistance([lon1, lat1], [lon2, lat2]);
const center = getCenterPoint(coordinates);
```

### Custom Hooks

```javascript
import { useGlobeData, useGlobeControls } from './hooks';

const { propertyData, arcData, heatmapData } = useGlobeData(properties);
const { handleViewStateChange } = useGlobeControls(autoRotate, setViewState);
```

## 🎨 Styling

Colors and styles can be customized in `utils/mapStyles.js`:

```javascript
export const PROPERTY_COLORS = {
  residential: [255, 215, 0, 200],
  // ... customize colors
};
```

## 📝 Notes

- The globe uses OpenStreetMap tiles for the base map
- Auto-rotation pauses for 3 seconds after user interaction
- Arc connections are limited to 50 for performance
- Hexagon aggregation uses 100km radius by default

## 🔮 Future Enhancements

- [ ] Add property filtering by type/price
- [ ] Implement search functionality
- [ ] Add custom property icons
- [ ] Support for property images in tooltips
- [ ] Time-based animation for property transactions
- [ ] Export/import property data
- [ ] Multiple globe themes (dark/light mode)
