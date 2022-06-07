<template>
    <div id="trafficPointsApp">
        <base-map @mapCreated="onMapCreated">
        </base-map>
        <el-dialog
                v-model="dialogVisible"
                title="添加点"
                width="30%"
                :show-close="false"
                draggable
                :close-on-click-modal="false"

        >
            <el-form label-suffix="：">
                <el-form-item label="点类型">
                    <el-select v-model="value"
                               @change="onChange"
                               placeholder="请选择类型"
                               clearable filterable>
                        <el-option
                                v-for="(item,index) in types"
                                :value="item"
                                :label="item.value"
                                :key="index">
                            <span style="float: left">{{ item.value }}</span>
                            <span style="float: right;width: 20px;height: 20px"
                                  :style="{backgroundColor: item.color}"></span>
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 10px" type="primary" @click="onXzClick">新增</el-button>

                </el-form-item>
                <el-form-item label="点颜色">
                    <div style="width: 40px;height: 40px;position: absolute;left: 60px;border-radius: 4px"
                         :style="{backgroundColor:color}"></div>
                </el-form-item>
            </el-form>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseClick">取消</el-button>
        <el-button type="primary" @click="onConfirmClick"
        >确定</el-button
        >
      </span>
            </template>
        </el-dialog>
        <el-dialog
                width="30%"
                v-model="xzVisible"
                title="新增"
                :show-close="false"
                :close-on-click-modal="false"
        >
            <el-form label-suffix="：">
                <el-form-item label="点类型">
                    <el-input style="width: 200px" v-model="xzValue" placeholder="请输入点类型"></el-input>
                </el-form-item>
                <el-form-item label="点颜色">
                    <el-color-picker color-format="rgb" v-model="xzColor"></el-color-picker>
                </el-form-item>
            </el-form>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="xzVisible=false">取消</el-button>
        <el-button type="primary" @click="onXzConfirmClick"
        >确定</el-button
        >
      </span>
            </template>

        </el-dialog>
        <el-table
                style="position: fixed;right: 10px;bottom: 10px;width: 20vw;max-height: 30vh;overflow-x: hidden "
                :data="types"
                fit
                height="30vh"
                v-show="types.length"
                @selection-change="onselectionchange"
        >
            <el-table-column prop="value" label="事件类型"></el-table-column>
            <el-table-column prop="color" label="颜色">
                <template #default="scope">
                    <div style="width: 40px;height: 20px" :style="{background:scope.row.color}"></div>
                </template>
            </el-table-column>
            <el-table-column type="selection" prop="显示"></el-table-column>
        </el-table>
        <el-button style="position: absolute;right: 20px;top: 20px" type="success">保存</el-button>
    </div>
</template>

<script>

    import BaseMap from "../../components/BaseMap";
    import EditbarMinxin from "../../minxins/EditbarMinxin";
    import locationPng from './img/loc.png'
    import dotPng from './img/dot.png'
    import {Style, Fill, Circle, Stroke, Text as TextStyle} from 'ol/style'
    import {ElMessage} from 'element-plus'
    import {Vector as VectorLayer,Image as ImageLayer,Tile as TileLayer} from 'ol/layer'
    import {Vector as VectorSource,ImageStatic,XYZ} from 'ol/source'
    import {guid} from "../../utils";
    import {transformExtent} from 'ol/proj'
    import szq from '../trafficPoints/img/szq.jpg'

    export default {
        name: "trafficPointsApp",
        components: {BaseMap},
        mixins: [EditbarMinxin],
        data() {
            return {
                dialogVisible: false,
                value: '',
                xzValue: '',
                xzColor: '',
                types: [
                    {value: '出租车', color: 'rgb(255,0,0)', id: 1},
                    {value: '小车', color: 'rgb(255,206,102)', id: 2},
                    {value: '货车', color: 'rgb(139,201,255)', id: 3},
                    {value: '客车', color: 'rgb(131,255,61)', id: 4},
                ],
                images: {
                    locationPng,
                    dotPng
                },
                color: 'rgb(255,0,0)',
                feature: null,
                features: [],
                xzVisible: false,
                featureLayer: null,
                imageLayer:null
            }
        },
        mounted() {

        },
        methods: {
            onMapCreated(map) {
                this.initMyMap(map)
                this.m_editBar.getInteraction('DrawPoint').on('drawstart', (e) => {
                    this.dialogVisible = true
                    this.feature = e.feature
                });
                let extent=new transformExtent([11525567.0814528,3435463.509567,11576460.4977151,3472754.2219682],'EPSG:3857','EPSG:4326')
                console.log(extent)
                this.imageLayer=new TileLayer({
                    source:new XYZ({
                        url:'/trafficPoints/cite_geotiff_coverage/EPSG_4326_{z}/'
                    })
                })
                map.addLayer(this.imageLayer)
                this.featureLayer = new VectorLayer({
                    source: new VectorSource()
                })
                map.addLayer(this.featureLayer)
                map.getView().fit(extent)
            },
            onConfirmClick() {
                if(this.value===''){
                    ElMessage.warning('类型不能为空！')
                }else {
                    this.feature.setStyle(new Style({
                        image: new Circle({
                            radius: 5,
                            fill: new Fill({
                                color: this.color
                            })
                        }),
                        stroke: new Stroke({
                            width: 1,
                            color: 'rgb(0,0,0)'
                        }),
                        text: new TextStyle({
                            text: this.value.value,
                            offsetY: 20,
                            scale:1.2
                        })

                    }))
                    this.feature.setProperties({
                        type: this.value.value,
                        uid: this.value.id
                    })
                    this.features.push({
                        feature: this.feature,
                        color: this.color,
                        type: this.value,
                        uid:this.value.id
                    })
                    this.dialogVisible = false
                }

            },
            onXzConfirmClick() {
                if (this.xzValue !== '' && this.xzColor !== '') {
                    this.types.push({
                        value: this.xzValue,
                        color: this.xzColor,
                        uid: guid()
                    })
                    this.xzVisible = false
                } else {
                    ElMessage.warning('类型或颜色不能为空!')
                }
            },
            onCloseClick() {
                this.dialogVisible = false
                if (this.feature) this.m_vector.getSource().removeFeature(this.feature)
            },
            onChange(value) {
                this.color = value.color
            },
            onselectionchange(value) {
                this.featureLayer.getSource().clear()
                let ids = value.map(v => v.id)
                let mFeature = this.features.filter(v => {
                    return ids.includes(v['uid'])
                })
                mFeature=mFeature.map(v=>v.feature)
               this.featureLayer.getSource().addFeatures(mFeature)
                this.m_vector.setVisible(false)
            },
            onXzClick() {
                this.xzVisible = true

            }
        }
    }
</script>

<style lang="less" scoped>
    #trafficPointsApp {
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 0;
        margin: 0;

    }

    .img-icon {
        transform: translateX(-100%);
        position: relative;

        img {
            border-right: 100px solid transparent;
            filter: drop-shadow(10px 0px 0 red)
        }
    }
</style>

