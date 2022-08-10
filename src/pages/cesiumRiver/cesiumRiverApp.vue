<template>
  <div id="cesiumRiverApp">
    <base-cesium-map @onViewerCreated="onViewInit" />
  </div>
</template>

<script>
import BaseCesiumMap from '@/components/BaseCesiumMap'
import { reactive } from 'vue'
import { addExtrudedGeoJson } from '@/utils/cesiumUtils'
import { addDataToGlobe, addExtrudedGeoJsonAsPrimitive } from '../../utils/cesiumUtils'

export default {
  components: { BaseCesiumMap },
  setup(props, { emit }) {
    const onViewInit = (viewer) => {
      const datasource = addExtrudedGeoJson(viewer, './data/geojson/yz1.json', 'Floor', 3)
      viewer.flyTo(datasource, {
        duration: 0
      })
      addExtrudedGeoJsonAsPrimitive(viewer, './data/geojson/yz1.json', 'Floor', 3)
    }
    return {
      onViewInit
    }
  }

}
</script>

<style scoped>
#cesiumRiverApp {
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 0;
  margin: 0;

}
</style>

