<template>
    <el-container id="routeApp">
        <el-header class="my_header">
            <el-dropdown>
                <el-avatar size="big" style="margin-right: 20px" shape="square">
                    {{userName}}
                </el-avatar>

                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>

            </el-dropdown>

        </el-header>
        <el-main class="my_main">
            <base-map :params="mapParams" :base-layer="gaodeLayers().gaodeVec" style="position: relative !important;"
                      @mapCreated="onMapCreated">
            </base-map>
            <navigation-pane
                    v-loading="loading"
                    :is-location-show="true"
                    id="navPane"
                    ref="navPane"
                    style="top: 80px !important;"
                    @reset="onResetClick"
                    @confirmClick="onConfirmClick"
                    @locationClick="onLocationClick"
            ></navigation-pane>
            <el-button
                    style="position: absolute;z-index: 999;top: 80px;left: 450px"
                    @click="saveCurrentRoute">保存当前路线
            </el-button>
            <el-button
                    style="position: absolute;z-index: 999;top: 80px;left: 600px"
                    @click="lookCurRoute"
            >查看历史路线
            </el-button>
            <div class="instruct-list" v-show="instruction.length">
                <div class="instruct-list-item"
                     @click="onItemCLick(item)"
                     v-for="(item,index) in instruction"
                     :key="index"
                >
                    {{item.instruction}}
                </div>
            </div>
        </el-main>
    </el-container>
    <div class="bottom-table" v-show="drawer">
        <div class="close" @click="drawer=false">X</div>
        <el-table height="320" @row-dblclick="rowClick" :data="routeData" size="mini" style="width: 100vw">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="createTime" label="保存时间" :formatter="dateFormat"></el-table-column>
            <el-table-column prop="startPos" label="起点位置"></el-table-column>
            <el-table-column prop="endPos" label="终点位置"></el-table-column>
            <el-table-column prop="start" label="起点经纬度"></el-table-column>
            <el-table-column prop="end" label="终点经纬度"></el-table-column>
            <el-table-column prop="distance" label="距离（KM）"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button type="warning" @click="handleDelete(scope)">
                        删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import BaseMap from "../../components/BaseMap";
    import NavigationPane from "../../components/NavigationPane";
    import {Vector as VectorLayer} from 'ol/layer'
    import {Vector as VectorSource} from 'ol/source'
    import {Point} from 'ol/geom'
    import Feature from 'ol/Feature'
    import {ICON_STYLE} from "../../config";
    import apiRoute from '../../api/apiRoute'
    import api from '../../api'
    import {clearCookie, fitLayer, routeAnalysis} from '../../utils';
    import GeolocationButton from "ol-ext/control/GeolocationButton"
    import "ol-ext/control/GeolocationBar.css"
    import {tianditu, mapboxLayers, gaodeLayers} from '../../config/baseLayersConfig'
    import { ElMessage } from 'element-plus'
    import {mapParams} from "../../config/mapConfig";

    import moment from 'moment'

    export default {
        name: "routeApp",
        components: {NavigationPane, BaseMap},
        data() {
            return {
                map: null,
                zjLayer: new VectorLayer(),
                instruction: [],
                timeInterval: null,
                dataFlowLayer: new VectorLayer({
                    source: new VectorSource()
                }),
                drawer: false,
                routeData: [],
                userName: '未登录',
                clearCookie,
                user: null,
                tianditu,
                mapboxLayers,
                gaodeLayers,
                locationBar: null,
                loading: null,
                mapParams
            }
        },
        created() {
            this.mapParams['maxZoom']=18
        },
        methods: {
            onMapCreated(map) {
                this.map = map
                this.map.addLayer(this.dataFlowLayer)
                this.map.addLayer(this.zjLayer)
                this.locationBar = new GeolocationButton({
                    delay: 3600 * 24
                })
                this.map.addControl(this.locationBar)

                this.init()
            },
            async onConfirmClick(res) {
                let [source, instruction, coords] = await res
                this.zjLayer.setSource(source)
                this.instruction = instruction
                if (source) {
                    this.map.getView().fit(source.getExtent())
                    this.map.getView().setZoom(this.map.getView().getZoom() - 2)
                }
                // this.moveCar(coords)
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
            },
            async init() {
                let res = await apiRoute.getLoginUser()
                let user = res.data
                this.user = user
                if (!user['nickName']) {
                    window.location.href = '/login'
                } else {
                    this.userName = user.nickName
                }
            },
            logout() {
                apiRoute.logout()
                window.location.href = '/login'
            },
            async saveCurrentRoute() {
                let curSource = this.zjLayer.getSource()
                if (curSource) {
                    let res = await apiRoute.getLoginUser()
                    this.user = res.data
                    if (this.user) {
                        apiRoute.addUserRoute({
                            userId: this.user['id'],
                            start: curSource.get('start'),
                            end: curSource.get('end'),
                            geom: JSON.stringify(curSource.get('geojson')),
                            startPos: this.$refs.navPane.startInput,
                            endPos: this.$refs.navPane.endInput,
                            distance: curSource.get('distance')
                        }).then(res => {
                            if (res.data) ElMessage.success('保存成功！')
                            this.lookCurRoute()
                        }).catch(e => {
                            ElMessage.error('保存失败！' + e)
                        })
                    } else {
                        ElMessage.warning('未登录！')
                    }
                } else {
                    ElMessage.warning('当前无路线数据！')
                }
            },
            async lookCurRoute() {
                if (this.user) {
                    apiRoute.getUserRoute({userId: this.user['id']}).then(res => {
                        let data = res.data
                        this.routeData = data
                        this.drawer = true
                    })

                }

            },
            dateFormat(row) {
                let date = row.updateTime;
                return moment(date).format('YYYY-MM-DD HH:mm:ss')
            },
            async rowClick(row) {

                routeAnalysis(row.start, row.end).then(res => {
                    this.zjLayer.setSource(res[0])
                    this.map.render()
                    fitLayer(this.map, res[0])
                    this.loading=false
                }).catch(err => {
                    ElMessage.error(err.toString())
                }).finally(() => {
                    this.loading=false
                })

            },
            onLocationClick() {
                this.locationBar.setActive(true)
                setTimeout(() => {
                    let loc = this.map.getView().getCenter().slice(0, 2).map(v => v.toFixed(5)).join(',')
                    this.loading = false
                    api.getRegeo({
                        location: loc
                    }).then(res => {
                        this.$refs.navPane.startInput = res.data.regeocode['formatted_address']
                        setTimeout(() => {
                            this.$refs.navPane.originLocation = loc
                            this.loading.close()
                        }, 500)
                    }).catch(err => {
                        ElMessage.error(err.toString())
                        this.loading=false

                    }).finally(() => {
                        this.loading=false
                    })
                }, 500)

            },
            handleDelete(item) {
                this.loading = true
                apiRoute.deleteUserRouteById({id: item.row.id}).then(res => {
                    ElMessage.success("删除成功！")
                    this.lookCurRoute()
                }).catch(err => {
                    ElMessage.error(err.toString())
                }).finally(() => {
                    this.loading = false
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    #routeApp {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 0;
        margin: 0;

    }

    .instruct-list {
        display: flex;
        flex-direction: column;
        position: fixed;
        right: 20px;
        top: 70px;
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

    .my_header {
        height: 60px;
        background: #54b2ff;
        display: flex;
        align-items: center;
        justify-content: right;
    }

    .my_main {
        height: calc(100% - 60px);
        padding: 0;
        margin: 0 !important;

    }

    .bottom-table {
        position: fixed;
        display: flex;
        flex-direction: column;
        bottom: 0;
        max-height: 320px;

        .close {
            display: flex;
            justify-content: right;
            background: white;
            padding-right: 10px;
            cursor: pointer;
        }
    }

</style>

