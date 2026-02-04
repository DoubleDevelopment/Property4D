import { ScatterplotLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';

export default class PropertyLayer extends ScatterplotLayer {
  static layerName = 'PropertyLayer';

  static defaultProps = {
    ...ScatterplotLayer.defaultProps,
    getPosition: { type: 'accessor', value: d => d.coordinates },
    getRadius: { type: 'accessor', value: 100000 },
    getFillColor: { type: 'accessor', value: [255, 215, 0, 200] }, // Golden
    getLineColor: { type: 'accessor', value: [255, 255, 255, 255] },
    lineWidthMinPixels: 2,
    radiusMinPixels: 3,
    radiusMaxPixels: 30,
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 100]
  };

  getShaders() {
    const shaders = super.getShaders();
    
    // Add custom vertex shader for pulsing effect
    shaders.vs = shaders.vs.replace(
      'void main(void) {',
      `
      uniform float time;
      void main(void) {
      `
    );

    return shaders;
  }

  draw(opts) {
    const { uniforms } = opts;
    
    // Add time uniform for animations
    super.draw({
      ...opts,
      uniforms: {
        ...uniforms,
        time: Date.now() / 1000
      }
    });
  }

  // Tooltip on hover
  getPickingInfo({ info, mode }) {
    const pickedInfo = super.getPickingInfo({ info, mode });
    
    if (pickedInfo.object) {
      pickedInfo.object = {
        ...pickedInfo.object,
        tooltip: `Property: ${pickedInfo.object.name || 'Unknown'}
Price: $${pickedInfo.object.price?.toLocaleString() || 'N/A'}
Location: ${pickedInfo.object.city || 'Unknown'}`
      };
    }
    
    return pickedInfo;
  }
}
