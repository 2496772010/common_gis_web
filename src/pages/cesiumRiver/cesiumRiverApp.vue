<template>
  <div id="cesiumRiverApp">
    <base-cesium-map @onViewerCreated="onViewInit" />
  </div>
</template>

<script>
import BaseCesiumMap from '@/components/BaseCesiumMap'

export default {
  components: { BaseCesiumMap },
  setup(props, { emit }) {
    const onViewInit = (viewer) => {
      console.log(viewer)
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

