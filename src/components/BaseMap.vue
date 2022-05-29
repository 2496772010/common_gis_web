<template>
  <div id="map"></div>
</template>

<script>
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import * as control from 'ol/control';
  import {Logo} from '@supermap/iclient-ol';
  // import {SpatialAnalystService} from '@supermap/iclient-ol/services/index'
  import {SuperMapCloud} from '@supermap/iclient-ol/mapping/index'
  // import {
  //     BufferDistance,
  //     BufferEndType,
  //     BufferSetting,
  //     GeometryBufferAnalystParameters
  // } from '@supermap/iclient-ol/index'
  import '@supermap/iclient-ol/dist/iclient-openlayers.css'
  // import {Vector as VectorLayer,Heatmap as HeatMapLayer} from 'ol/layer'
  // import {Vector as VectorSource} from 'ol/source'
  // import {GeoJSON} from 'ol/format'
  // import Feature from 'ol/Feature';
  // import {Point, Circle, LineString} from 'ol/geom';
  // import {Draw} from 'ol/interaction'
  // import {Icon as IconStyle, Style, Text as TextStyle} from 'ol/style'
  import 'ol/ol.css'
  // import api from './api'
  // import {ElMessage} from 'element-plus'
  // import Overlay from 'ol/Overlay'

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
