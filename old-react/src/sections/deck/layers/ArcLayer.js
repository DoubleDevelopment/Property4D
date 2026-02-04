import { ArcLayer as DeckArcLayer } from '@deck.gl/layers';

export default class ArcLayer extends DeckArcLayer {
  static layerName = 'CustomArcLayer';

  static defaultProps = {
    ...DeckArcLayer.defaultProps,
    getSourcePosition: { type: 'accessor', value: d => d.from },
    getTargetPosition: { type: 'accessor', value: d => d.to },
    getSourceColor: { type: 'accessor', value: [255, 215, 0, 150] }, // Golden
    getTargetColor: { type: 'accessor', value: [255, 140, 0, 150] }, // Orange
    getWidth: { type: 'accessor', value: 3 },
    getHeight: { type: 'accessor', value: 0.5 },
    greatCircle: true,
    pickable: true
  };

  // Override to add animation
  draw(opts) {
    const { uniforms } = opts;
    
    super.draw({
      ...opts,
      uniforms: {
        ...uniforms,
        time: Date.now() / 1000
      }
    });
  }
}
