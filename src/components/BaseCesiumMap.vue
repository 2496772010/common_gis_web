<template>
  <div id="cesiumContainer" />
</template>

<script>
import { onMounted, reactive } from 'vue'

export default {
  setup(props, { emit }) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NGZjOWQ5Zi1hNGRhLTQxODktOGQzNC05MGE4MGY4NWFiNzQiLCJpZCI6MTYzMTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzAxNjg2MzV9.VV0jzIIN5Sc-H1mq9RIsbHDd3y-ZhORd63g62sxpX80'
    let cesiumViewer = reactive({})

    const initMap = () => {
      cesiumViewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        baseLayerPicker: true,
        depthTestAgainstTerrain: false
      })
      // 初始化后传出viewer实例
      emit('onViewerCreated', cesiumViewer)
    }
    onMounted(initMap)
    return {
      cesiumViewer
    }
  }

}
</script>

<style scoped>
#cesiumContainer {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
