<template>
    <div>
        <base-map @mapCreated="onMapCreated">
        </base-map>
        <navigation-pane
                @reset="onResetClick"
                @confirmClick="onConfirmClick"></navigation-pane>
        <div class="instruct-list" v-show="instruction.length">
            <div class="instruct-list-item"
                 @click="onItemCLick(item)"
                 v-for="(item,index) in instruction"
                 :key="index"
            >
                {{item.instruction}}
            </div>
        </div>

    </div>
</template>

<script>
    import BaseMap from "../../../components/BaseMap";
    import NavigationPane from "../components/NavigationPane";
    import {Vector as VectorLayer} from 'ol/layer'
    import {Vector as VectorSource} from 'ol/source'
    import {Point} from 'ol/geom'
    import Feature from 'ol/Feature'
    import {ICON_STYLE} from "../../../config";

    export default {
        name: "ZjVisualization",
        components: {NavigationPane, BaseMap},
        data() {
            return {
                map: null,
                zjLayer: new VectorLayer(),
                instruction: [],
                timeInterval: null,
                dataFlowLayer: new VectorLayer({
                    source: new VectorSource()
                })
            }
        },
        methods: {
            onMapCreated(map) {
                this.map = map
                this.map.addLayer(this.dataFlowLayer)
            },
            async onConfirmClick(res) {
                let [source, instruction, coords] = await res
                this.zjLayer.setSource(source)
                this.map.addLayer(this.zjLayer)
                this.instruction = instruction
                if (source) {
                    this.map.getView().fit(source.getExtent())
                    this.map.getView().setZoom(this.map.getView().getZoom() - 2)
                }
                this.moveCar(coords)


            },
            onItemCLick(value) {
                this.map.getView().setCenter(value.location)
                this.map.getView().setZoom(17)
            },
            onResetClick() {
                this.zjLayer.getSource().clear()
                this.instruction = []
                this.dataFlowLayer.getSource().clear()
            },
            moveCar(coords) {
                let a = 0
                this.timeInterval = setInterval(() => {
                    if (this.dataFlowLayer.getSource()) {
                        this.dataFlowLayer.getSource().clear()
                    }
                    let feature = new Feature({
                        geometry: new Point(coords[a])
                    })
                    feature.setStyle(ICON_STYLE)
                    this.dataFlowLayer.getSource().addFeature(feature)

                    this.map.getView().setCenter(coords[a])
                    a += 1
                    if (a >= coords.length - 1) {
                        clearInterval(this.timeInterval)
                    }

                }, 100)
            }


        }
    }
</script>

<style lang="less" scoped>
    .instruct-list {
        display: flex;
        flex-direction: column;
        position: fixed;
        right: 20px;
        top: 20px;
        background: #fff;
        border-radius: 4px;
        width: 26vw;
        height: 80vh;
        overflow-y: scroll;
        padding: 10px;

        .instruct-list-item {
            width: 24vw;
            height: 80px;
            cursor: pointer;
            padding: 10px 0 10px 0;

            &:hover {
                background: rgba(159, 158, 188, 0.5);
            }
        }
    }
</style>