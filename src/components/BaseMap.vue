<template>
  <div id="map"></div>
</template>

<script>
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import * as control from 'ol/control';
  import {Logo} from '@supermap/iclient-ol';
  import {SuperMapCloud} from '@supermap/iclient-ol/mapping/index'
  import '@supermap/iclient-ol/dist/iclient-openlayers.css'
  import 'ol/ol.css'

  export default {
    name: "BaseMap",
    data() {
      return {
        map: null,
        view: null
      }
    },
    mounted() {
      this.initMap()
    },
    props: {
      params: {
        type: Object,
        default: () => {
          return {
            center: [119.01, 32.5],
            zoom: 13,
            projection: 'EPSG:4326'
          }
        }
      },
      baseLayer: {
        type: Object,
        default: () => {
          return new TileLayer({
            title: 'supermap',
            type: 'base',
            source: new SuperMapCloud()
          })
        }
      }
    },
    methods: {
      initMap() {
        this.view = new View({
          ...this.params,
          multiWorld: true
        })
        this.map = new Map({
          target: 'map',
          logo:false,
          controls: control.defaults(
                  {
                    attribution:false,
                    attributionOptions: {
                      collapsed: false,collapsible:false
                    }
                  }).extend([new Logo()]),
          view: this.view
        });
        this.map.addLayer(this.baseLayer);
        this.map.once('postrender', () => {
          this.$emit('mapCreated', this.map)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  #map {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

</style>
