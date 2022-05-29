<template>
    <div id="trafficPointsApp">
        <base-map @mapCreated="onMapCreated">
        </base-map>
        <el-dialog
                v-model="dialogVisible"
                title="添加点"
                width="30%"
                show-close
                draggable
                :close-on-click-modal="false"

        >
            <el-form label-suffix="：">
                <el-form-item label="点类型">
                    <el-select v-model="value"
                               @change="onChange"
                               placeholder="请输入或选择类型"
                               allow-create clearable filterable>
                        <el-option
                                v-for="(item,index) in types"
                                :value="item"
                                :label="item"
                                :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="点颜色">
                    <el-color-picker color-format="rgb" v-model="color"></el-color-picker>
                </el-form-item>
            </el-form>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirmClick"
        >确定</el-button
        >
      </span>
            </template>
        </el-dialog>
        <el-table
                style="position: fixed;right: 10px;bottom: 10px;width: 200px;max-height: 30vh;overflow-x: hidden "
                :data="features"
                fit
                height="200"
                v-show="features.length"
        >
            <el-table-column prop="type" label="事件类型"></el-table-column>
            <el-table-column prop="color" label="颜色">
                <template #default="scope">
                    <div style="width: 40px;height: 20px" :style="{background:scope.row.color}"></div>
                </template>
            </el-table-column>
        </el-table>
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
                value: '出租车',
                types: ['出租车'],
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
                this.dialogVisible = false
                if (!this.features.filter(value => {
                    return value.color === this.color && this.value === value.type
                }).length) {
                    this.features.push({
                        feature: this.feature,
                        color: this.color,
                        type: this.value
                    })

                }
            },
            onChange(value) {
                if (this.types.indexOf(value) < 0) {
                    this.types.push(value)
                }
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

