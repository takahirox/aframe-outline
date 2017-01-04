/**
 * @author Takahiro / https://github.com/takahirox
 */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before' +
                  'AFRAME was available.');
}

require('three/examples/js/effects/OutlineEffect');

AFRAME.registerComponent('outline', {
  schema: {
    thickness: {type:'number', default: 0.003},
    color: {type:'color', default: '#000'},
    alpha: {type:'number', default: 1.0}
  },

  init: function () {
    this.effect = null;
  },

  update: function () {
    this.setupOutlineEffect();
  },

  play: function () {
    // just in case
    this.setupOutlineEffect();
  },

  setupOutlineEffect: function () {
    if (this.effect !== null) { return; }

    var data = this.data;
    var el = this.el;
    var sceneEl = el.sceneEl;
    var renderer = sceneEl.renderer;
    var effect = sceneEl.effect;

    if (renderer === undefined || effect === undefined) { return; }

    var outlineEffect = new THREE.OutlineEffect(renderer, {
      defaultThickness: data.thickness,
      defaultColor: new THREE.Color(data.color),
      defaultAlpha: data.alpha
    });

    // override scene effect
    // this's very sensitive to sceneEl impl
    var keys = Object.keys(renderer);
    for (var i = 0, il = keys.length; i < il; i++) {
      var key = keys[i];
      if (outlineEffect[key] === undefined) {
        outlineEffect[key] = typeof renderer[key] === 'function'
                          ? renderer[key].bind(renderer)
                          : renderer[key];
      }
    }
    this.effect = outlineEffect;
    sceneEl.effect = new THREE.VREffect(outlineEffect);
  }
});
