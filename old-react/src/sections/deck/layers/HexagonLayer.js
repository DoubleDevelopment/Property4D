import { HexagonLayer as DeckHexagonLayer } from '@deck.gl/aggregation-layers';

export default class HexagonLayer extends DeckHexagonLayer {
  static layerName = 'CustomHexagonLayer';

  static defaultProps = {
    ...DeckHexagonLayer.defaultProps,
    getPosition: { type: 'accessor', value: d => d.coordinates },
    radius: 100000,
    elevationScale: 1000,
    extruded: true,
    coverage: 0.8,
    colorRange: [
      [255, 255, 178],
      [254, 217, 118],
      [254, 178, 76],
      [253, 141, 60],
      [252, 78, 42],
      [227, 26, 28]
    ],
    elevationRange: [0, 3000],
    pickable: true,
    autoHighlight: true
  };

  // Custom aggregation for property density
  getSubLayerProps(props) {
    const subLayerProps = super.getSubLayerProps(props);
    
    return {
      ...subLayerProps,
      updateTriggers: {
        ...subLayerProps.updateTriggers,
        getElevation: [props.data]
      }
    };
  }
}
