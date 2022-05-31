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
                               placeholder="请输入或选择类型"
                               clearable filterable>
                        <el-option
                                v-for="(item,index) in types"
                                :value="item.color"
                                :label="item.value"
                                :key="index"></el-option>
                    </el-select>
                    <el-button style="margin-left: 10px" type="primary">新增</el-button>

                </el-form-item>
                <el-form-item label="点颜色">
                    <el-color-picker color-format="rgb" v-model="color"></el-color-picker>
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
        <el-table
                style="position: fixed;right: 10px;bottom: 10px;width: 20vw;max-height: 30vh;overflow-x: hidden "
                :data="features"
                fit
                height="30vh"
                v-show="features.length"
                @selection-change="onselectionchange"
        >
            <el-table-column prop="type" label="事件类型"></el-table-column>
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
    import {Style, Fill, Circle, Stroke} from 'ol/style'

    export default {
        name: "trafficPointsApp",
        components: {BaseMap},
        mixins: [EditbarMinxin],
        data() {
            return {
                dialogVisible: false,
                value: 'rgb(255,0,0)',
                types: [
                    {value: '出租车', color: 'rgb(255,0,0)'},
                    {value: '小车', color: 'rgb(255,206,102)'},
                    {value: '货车', color: 'rgb(139,201,255)'},
                    {value: '客车', color: 'rgb(131,255,61)'},
                ],
                images: {
                    locationPng,
                    dotPng
                },
                color: 'rgb(255,0,0)',
                feature: null,
                features: []
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
            },
            onConfirmClick() {
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
                    })

                }))
                this.feature.setProperties({
                    type: this.value
                })
                let isAdd = this.features.find(value => {
                    return value.color === this.color || this.value === value.type
                })
                if (!isAdd) {
                    this.features.push({
                        feature: this.feature,
                        color: this.color,
                        type: this.value
                    })
                }
                this.dialogVisible = false
            },
            onCloseClick() {
                this.dialogVisible = false
                if (this.feature) this.m_vector.getSource().removeFeature(this.feature)
            },
            onChange(value) {
                if (this.types.indexOf(value) < 0) {
                    this.types.push(value)
                }
            },
            onselectionchange(value) {
                console.log(value)
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

