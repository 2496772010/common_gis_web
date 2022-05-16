<template>
    <div>
        <base-map @mapCreated="onMapCreated"></base-map>
    </div>
</template>

<script>
    import BaseMap from "../../../components/BaseMap";
    import {Heatmap as HeatMapLayer} from 'ol/layer'
    import {createHeatMapSource} from "../../../utils";
    import {TRAVEL_CODES} from "../../../GaoDeCodeconfig";

    export default {
        name: "JdHeatmap",
        components: {BaseMap},
        data() {
            return {
                heatLayer: new HeatMapLayer({
                    blur: 20,
                    radius: 10
                }),
                map: null
            }
        },
        methods: {
            onMapCreated(map) {
                this.map = map
                this.init()
            },
            async init() {
                this.map.addLayer(this.heatLayer)
                let source =await createHeatMapSource('邯郸市', TRAVEL_CODES)
                this.heatLayer.setSource(source)
                console.log(this.heatLayer)
                console.log(source)
            }
        }
    }
</script>

<style scoped>

</style>