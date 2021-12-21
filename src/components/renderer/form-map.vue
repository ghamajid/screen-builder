<template>
  <div>
    <label>{{ label }}</label>
    <div>
      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" :default-controls="false"
        ref="map" data-projection="EPSG:4326" style="height: 400px" @click="getLocation"
      >
        <vl-view :zoom.sync="zoom" :center.sync="centerbase" :rotation.sync="rotation"/>
        <vl-layer-tile>
          <vl-source-osm/>
        </vl-layer-tile>

        <vl-feature>
          <vl-geom-multi-point v-if="center[0] != 54.368262 && center[1] != 31.883796" :coordinates="[center]"/>
          <vl-style-box>
            <vl-style-icon src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" :scale="0.09" :anchor="[0.5, 1]"/>
          </vl-style-box>
        </vl-feature>
      </vl-map>
      <div class="form-group">
        <label >{{ $t('Latitude') }}</label>
        <input :value='center[1].toFixed(6)' class="form-control" >
      </div>
      <div class="form-group">
        <label >{{ $t('Longitude') }}</label>
        <input :value='center[0].toFixed(6)' class="form-control" >
      </div>
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Vue from 'vue';
import VueLayers from 'vuelayers';
import 'vuelayers/lib/style.css';
import {MultiPointGeom} from 'vuelayers';
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';

Vue.use(MultiPointGeom);
Vue.use(VueLayers);

export default {
  data() {
    return {
      zoom: 5,
      centerbase: [54.368262, 31.883796],
      center: [54.368262, 31.883796],
      rotation: 0,
      mpProj: 'EPSG:4326',
      mpPrecision: 4,
    };
  },

  props: [
    'transientData',
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'placeholder',
    'dataFormat',
    'thcolor',
    'fields',
    'url_grid',
  ],

  watch: {
    mpProj(v) {
      this.mpCtrl && this.mpCtrl.setProjection(v);
    },
    mpPrecision(v) {
      this.mpCtrl && this.mpCtrl.setCoordinateFormat(createStringXY(v));
    },
  },
  methods: {
    mapCreated(vm) {
      this.mpCtrl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: this.mpProj,
        undefinedHTML: ' ',
      });
      vm.$map.addControl(this.mpCtrl);
    },
    getLocation(eve) {
      this.center = eve.coordinate;
      this.$emit('input' , {"Latitude" : this.center[1].toFixed(6) , "Longitude" : this.center[0].toFixed(6)}
      );
    },
  },
};
</script>
