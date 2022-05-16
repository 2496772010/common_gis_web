<template>
  <div id="trafficPointApp">
    <base-map :params="mapParams"></base-map>
  
  </div>
</template>

<script>

  import BaseMap from "../../components/BaseMap";
  import {mapParams} from "../../config/mapConfig";

  export default {
    name: "trafficPointApp",
    components: {BaseMap},
    data() {
      return {
        mapParams
      }
    },
    methods: {}
  }
</script>

<style scoped>
  #trafficPointApp {
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 0;
    margin: 0;
    
  }
</style>

