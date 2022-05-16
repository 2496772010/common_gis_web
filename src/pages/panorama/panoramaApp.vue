<template>
    <div id="panoramaApp">
        <base-map
                :params="params"
                :base-layer="baseLayer"
                @mapCreated="onMapCreated"></base-map>
        <div v-show="panoramaVisible" class="info-pane">
            <div @click="panoramaVisible=false" style="display: flex;justify-content: right;cursor: pointer">X</div>
            <div class="panorama-viewer" id="panoramaViewer">
            </div>
            <images-scroll style="height: 22vh" @imgclick="onImgClick" :imgs="curImgs"></images-scroll>
        </div>
        <div class="info-table" v-show="tableShow">
            <div @click="tableShow=false" style="display: flex;justify-content: right;cursor: pointer">X</div>
            <el-table height="70vh" :data="tableData" size="mini">
                <el-table-column prop="name" label="名字"></el-table-column>
                <el-table-column prop="number" label="门牌号"></el-table-column>
                <el-table-column prop="street" label="街道"></el-table-column>
            </el-table>
        </div>
        <el-button @click="clearClick" style="position: absolute;z-index: 999;top: 20px;right: 20px" type="primary">清除
        </el-button>
        <el-button @click="drawCircle" style="position: absolute;z-index: 999;top: 20px;right: 120px" type="success">
            绘制范围
        </el-button>
        <span style="position: absolute;z-index: 999;
        border-radius: 4px;
        width: fit-content;
        margin: 0 10px 0 10px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        right: 220px;top: 20px;background: white"
              v-show="curTotal!==0">当前绘制范围共居住有{{curTotal}}人</span>

    </div>
</template>

<script>
    import {mapboxLayers, tianditu} from "../../config/baseLayersConfig";
    import BaseMap from "../../components/BaseMap";
    import {mapParams} from "../../config/mapConfig";
    import {Viewer} from 'photo-sphere-viewer';
    import jdImage from './panoramaImages/街道.jpg'
    import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
    import dataJson from './asserts/pois.json'
    import {Vector as VectorLayer} from 'ol/layer'
    import {Vector as VectorSource} from 'ol/source'
    import {getPointSource} from "../../utils";
    import {Select} from 'ol/interaction'
    import PopupFeature from 'ol-ext/overlay/PopupFeature'
    import 'ol-ext/overlay/Popup.css'
    import ImagesScroll from "../../components/ImagesScroll";
    import {read, utils} from 'xlsx'
    import axios from 'axios'
    import Draw,{createBox} from 'ol/interaction/Draw'
    import Point from 'ol/geom/Point'

    export default {
        name: "panoramaApp",
        components: {ImagesScroll, BaseMap},
        data() {
            return {
                baseLayer: mapboxLayers().satelliteLayer,
                params: mapParams,
                panorama: null,
                poiLayer: null,
                panoramaVisible: false,
                select: null,
                pop: null,
                curImgs: [],
                tableData: [],
                tableShow: false,
                isInit: false,
                drawLayer: null,
                drawSource: new VectorSource(),
                draw: null,
                drawActive: false,
                curTotal: 0
            }
        },
        created() {
            mapParams.center = [113.64578817657906, 23.116560247510847]
        },
        methods: {
            onMapCreated(map) {
                this.map = map
                this.init()
                this.initDraw()
            },
            init() {
                this.curTotal = 0
                this.map.addLayer(tianditu().tileMark)
                this.panorama = new Viewer({
                    container: document.querySelector('#panoramaViewer'),
                    panorama: jdImage,
                })
                this.poiLayer = new VectorLayer({
                    source: getPointSource(dataJson)
                })
                this.map.addLayer(this.poiLayer)
                this.select = new Select({
                    filter:(f)=>{
                        return f.getGeometry() instanceof Point
                    }
                })
                this.map.addInteraction(this.select)
                this.pop = new PopupFeature({
                    popupClass: 'default anim',
                    select: this.select,
                    canFix: true,
                    template: {
                        title: '详细信息',
                    },
                    closeBox: true
                })
                this.map.addOverlay(this.pop)
                // fitLayer(this.map, this.poiLayer.getSource())
                this.select.getFeatures().on(['add'], async (e) => {
                    let feature = await e.target
                    feature = feature.array_
                    if (feature.length) {
                        feature = feature[0]
                        let info = feature.getProperties()
                        let loc = info['地址']
                        let imgs = info['Images'].split(';')
                        let imgArr = []
                        let table = `./data/${loc}/data.xlsx`
                        console.log(table)
                        axios.get(table, {responseType: 'arraybuffer'})
                            .then((res) => {
                                let data = new Uint8Array(res.data)

                                let wb = read(data, {type: "array"})
                                let sheets = wb.Sheets.Sheet1
                                let json = utils.sheet_to_json(sheets)
                                this.tableData = json
                            }).catch(err => {
                            console.log(err)
                        })


                        imgs.forEach(item => {
                            imgArr.push({
                                img: require(`./data/${loc}/${item}`),
                                name: item
                            })
                        })
                        this.curImgs = imgArr
                        this.panorama.setPanorama(imgArr[0].img)
                        this.panoramaVisible = true
                        let evt = new Event('resize')
                        window.dispatchEvent(evt)
                        this.tableShow = true
                        this.isInit = true
                    }
                })
            },
            initTable() {

            },
            initDraw() {
                this.drawLayer = new VectorLayer({
                    source: this.drawSource
                })
                this.map.addLayer(this.drawLayer)
                this.draw = new Draw({
                    type: 'Circle',
                    source: this.drawSource,
                    geometryFunction:createBox()
                })
                this.draw.on('drawstart', () => {
                    this.drawSource.clear()
                    this.curTotal = 0
                })
                this.draw.on('drawend', (e) => {
                    let features = dataJson.features
                    let circle = e.feature.getGeometry()
                    features.forEach(f => {
                        let fc = f.geometry.coordinates
                        if (circle.intersectsCoordinate(fc)) {
                            this.curTotal += f.properties['居住人员']
                        }
                    })
                })
                this.map.addInteraction(this.draw)
                this.draw.setActive(false)
            },
            onImgClick(item) {
                this.panorama.setPanorama(item.img)
            },
            clearClick() {
                this.drawSource.clear()
                this.draw.setActive(false)
                this.curTotal=0
            },
            drawCircle() {
                this.drawSource.clear()
                this.draw.setActive(true)
                this.panoramaVisible=false
                this.tableShow=false
                this.pop.close()
            }
        }
    }
</script>

<style lang="less" scoped>
    #panoramaApp {
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 0;
        margin: 0;
    }

    .info-table {
        background: white;
        width: 30vw;
        height: 60vh;
        right: 20px;
        top: 80px;
        position: absolute;
    }

    .info-pane {
        width: 30vw;
        height: 80vh;
        position: absolute;
        z-index: 999;
        background: white;
        left: 40px;
        top: 80px;
        border: 1px solid gray;
        border-radius: 4px;


        .panorama-viewer {
            z-index: 999;
            width: 30vw;
            height: 60vh;
        }
    }
</style>

