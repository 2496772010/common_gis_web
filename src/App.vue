<template>
  <el-container class="main">
    
    <el-aside style="width: 20vw; background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template #title><i class="el-icon-message"></i>导航服务</template>
          <el-menu-item-group>
            <template #title>分组一</template>
            <el-menu-item @click="showType=1" index="1-1">路线导航</el-menu-item>
            <el-menu-item @click="showType=2" index="1-2">医院服务范围查询</el-menu-item>
            <el-menu-item @click="showType=3" index="1-3">救护车实时位置</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template #title><i class="el-icon-menu"></i>周边查询</template>
          <el-menu-item-group>
            <template #title>分组一</template>
            <el-menu-item @click="showType=4" index="2-1">医疗设施查询</el-menu-item>
            <el-menu-item @click="showType=5" index="2-2">周边服务</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template #title><i class="el-icon-menu"></i>可视化展示</template>
          <el-menu-item-group>
            <el-menu-item @click="showType=6" index="3-1">医院分布热力图</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
<!--        <el-submenu index="4">-->
<!--          <template #title><i class="el-icon-menu"></i>健康论坛</template>-->
<!--          <el-menu-item-group>-->
<!--            <el-menu-item @click="pageJump" index="4-1">进入论坛</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--        </el-submenu>-->
      </el-menu>
    </el-aside>
    <el-main style="width: 80vw; padding: 0;margin: 0">
      <div id="map">
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
        <div class="pos" v-show="showType===1">
          <label>起点：</label>
          <el-autocomplete
            v-model="startInput"
            :fetch-suggestions="querySearchAsyncStart"
            placeholder="请输起点"
            @select="handleSelectStart"
          >
            <template #default="{ item }">
              <div class="name">{{ item.name }}</div>
            </template>
          </el-autocomplete>
          <label>终点：</label>
          <el-autocomplete
            v-model="endInput"
            :fetch-suggestions="querySearchAsyncEnd"
            placeholder="请输入终点"
            @select="handleSelectEnd"
          >
            <template #default="{ item }">
              <div class="name">{{ item.name }}</div>
            </template>
          </el-autocomplete>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
        <div class="pos" v-show="showType===2">
          <label>时间：</label>
          <el-input-number v-model="bufferTime"></el-input-number>
          <br>
          <label>查询医院服务范围（分钟）</label>
          <el-autocomplete
            v-model="hospitalInput"
            :fetch-suggestions="querySearchAsyncHospital"
            placeholder="请输医院名称"
            @select="handleSelectHospital"
          >
            <template #default="{ item }">
              <div class="name">{{ item.name }}</div>
            </template>
          </el-autocomplete>
        </div>
        <div class="pos" v-show="showType===3">
          <el-button @click="onDataFlowClick">开始监测</el-button>
        </div>
        <div class="pos" v-show="showType===4">
          <label>查询距离（m）：</label>
          <el-input-number v-model="bufferDistance"></el-input-number>
          <br>
          <label>查询类型：</label>
          <el-select v-model="type">
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
            <el-option
                label="医院"
                value="hospital">
            </el-option>
            <el-option
                label="药店"
                value="pharmacy">
            </el-option>
          </el-select>
        </div>
        <div class="pos" v-show="showType===5">
          <label>查询距离（m）：</label>
          <el-input-number v-model="bufferDistance2"></el-input-number>
          <br>
          <label>查询类型：</label>
          <el-select v-model="type">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import * as control from 'ol/control';
  import {Logo} from '@supermap/iclient-ol';
  import {SpatialAnalystService} from '@supermap/iclient-ol/services/index'
  import {SuperMapCloud} from '@supermap/iclient-ol/mapping/index'
  import {
    BufferDistance,
    BufferEndType,
    BufferSetting,
    GeometryBufferAnalystParameters
  } from '@supermap/iclient-ol/index'
  import '@supermap/iclient-ol/dist/iclient-openlayers.css'
  import {Vector as VectorLayer,Heatmap as HeatMapLayer} from 'ol/layer'
  import {Vector as VectorSource} from 'ol/source'
  import {GeoJSON} from 'ol/format'
  import Feature from 'ol/Feature';
  import {Point, Circle, LineString} from 'ol/geom';
  import {Draw} from 'ol/interaction'
  import {Icon as IconStyle, Style, Text as TextStyle} from 'ol/style'
  import 'ol/ol.css'
  import api from './api'
  import {ElMessage} from 'element-plus'
  import Overlay from 'ol/Overlay'

  export default {
    name: 'App',
    components: {},
    data() {
      return {
        map: null,
        view: null,
        showType: null,
        startInput: '',
        endInput: '',
        hospitalInput: '',
        targetLocation: '',
        originLocation: '',
        routeLayer: null,
        bufferTime: 60,
        bufferLayer: null,
        bufferSource: null,
        bufferDistance: 2000,
        bufferDistance2: 2000,
        drawInteraction: null,
        drawInteraction1: null,
        serviceUrl: 'https://iserver.supermap.io/iserver/services/spatialanalyst-changchun/restjsr/spatialanalyst',
        bufferLayer1: null,
        bufferLayer2: null,
        dataFlowLayer: null,
        overLay: null,
        content: null,
        timeInterval: null,
        hospitalTypes: '090100|090101|090102|090200|090202|090203|090204|090205|090206|090207|090208|090209|090210|090211|090400',
        pharmacyTypes: '090600|090601|090602',
        type: 'hospital',
        options: [{value: 'hospital', label: '医院'}, {value: 'pharmacy', label: '药店'}],
        heatLayer:null,
        tempHeatPoints:[]
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        const container = document.getElementById("popup");
        console.log(container)
        this.content = document.getElementById("popup-content");
        this.overLay = new Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        })

        this.view = new View({
          center: [114.467, 36.6],
          zoom: 13,
          projection: 'EPSG:4326',
          multiWorld: true
        })
        this.map = new Map({
          target: 'map',
          controls: control.defaults({attributionOptions: {collapsed: false}}).extend([new Logo()]),
          view: this.view
        });
        this.map.addOverlay(this.overLay)
        let layer = new TileLayer({
          title: 'supermap',
          type: 'base',
          source: new SuperMapCloud()
        });
        this.map.addLayer(layer);
        this.routeLayer = new VectorLayer({
          source: new VectorSource({})
        })
        this.map.addLayer(this.routeLayer)
        this.bufferSource = new VectorSource({})
        this.bufferLayer = new VectorLayer({
          source: new VectorSource({})
        })
        this.map.addLayer(this.bufferLayer)
        this.bufferLayer1 = new VectorLayer({
          source: new VectorSource({})
        })
        this.map.addLayer(this.bufferLayer1)
        this.bufferLayer2 = new VectorLayer({
          source: new VectorSource({})
        })
        this.map.addLayer(this.bufferLayer2)
        this.dataFlowLayer = new VectorLayer({
          source: new VectorSource({})
        })
        this.map.addLayer(this.dataFlowLayer)
        this.heatLayer=new HeatMapLayer({
          source:new VectorSource({}),
          blur:20,
          radius:10
        })
        this.map.addLayer(this.heatLayer)
        this.drawInteraction = new Draw({
          source: this.bufferLayer.getSource(),
          type: "Point",
          snapTolerance: 20
        })
        this.drawInteraction1 = new Draw({
          source: this.bufferLayer.getSource(),
          type: "Point",
          snapTolerance: 20
        })

      },
      async querySearchAsyncStart(queryString, cb) {
        let res = await api.getInputTips({keywords: queryString})
        let results = res.data.tips
        cb(results)
      },
      handleSelectStart(value) {
        this.startInput = value.name
        this.originLocation = value.location
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      async querySearchAsyncEnd(queryString, cb) {
        let res = await api.getInputTips({keywords: queryString})
        let results = res.data.tips
        cb(results)
      },
      handleSelectEnd(value) {
        this.endInput = value.name
        this.targetLocation = value.location
      },
      async querySearchAsyncHospital(queryString, cb) {
        let res = await api.getInputTips({keywords: queryString})
        let results = res.data.tips
        cb(results)
      },
      handleSelectHospital(value) {
        this.hospitalInput = value.name
        let location = value.location.split(',').map(Number)
        let point = new Feature({
          geometry: new Point(location)
        })
        point.setStyle(new Style({
          image: new IconStyle({
            src: './终点.png',
            scale: 0.2
          }),
          text: new TextStyle({
            text: value.name
          })
        }))
        this.bufferLayer.getSource().addFeature(point)
        let distance = this.RandomNumBoth(100, 200)
        distance = distance * this.bufferTime / 111000
        console.log(distance)
        let geoBufferAnalystParams = new GeometryBufferAnalystParameters({
          sourceGeometry: new Point(location),
          bufferSetting: new BufferSetting({
            endType: BufferEndType.ROUND,
            leftDistance: new BufferDistance({value: distance}),
            rightDistance: new BufferDistance({value: distance}),
            semicircleLineSegment: 10,
            // radiusUnit: BufferRadiusUnit.METER
          })
        });
        //向iServer发送请求并返回结果
        new SpatialAnalystService(this.serviceUrl).bufferAnalysis(geoBufferAnalystParams, (serviceResult) => {
          this.bufferLayer.getSource().addFeatures(new GeoJSON().readFeatures(serviceResult.result.resultGeometry))
          this.view.setCenter(location)
        })
      },
      async confirmClick() {
        if (this.originLocation && this.targetLocation) {
          let startCoord = this.originLocation.split(',').map(Number)
          let endCoord = this.targetLocation.split(',').map(Number)
          console.log(startCoord)
          console.log(endCoord)
          let res = await api.getRoute({origin: this.originLocation, destination: this.targetLocation})
          let steps = res.data.route.paths[0].steps
          let coords = []
          steps.forEach(value => {
            let polyline = value.polyline.split(';')
            polyline = polyline.map(function (value) {
              return value.split(',').map(Number)
            })
            coords = coords.concat(polyline)
          })
          let geoJSON = {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": coords
              }
            }]
          }
          let startFeature = new Feature({
            geometry: new Point(startCoord)
          })
          startFeature.setStyle(new Style({
            image: new IconStyle({
              src: './起点.png',
              scale: 0.2
            })
          }))
          let endFeature = new Feature({
            geometry: new Point(endCoord)
          })
          endFeature.setStyle(new Style({
            image: new IconStyle({
              src: './location.png',
              scale: 0.2
            })
          }))
          console.log(geoJSON)
          let source = new VectorSource({
            features: new GeoJSON().readFeatures(geoJSON)
          })
          source.addFeature(startFeature)
          source.addFeature(endFeature)
          this.routeLayer.setSource(source)
          this.view.setCenter(startCoord)
        }

      },
      async refreshMap(type) {
        if (this.routeLayer) {
          this.routeLayer.getSource().clear()
        }
        if (this.bufferLayer) {
          this.bufferLayer.getSource().clear()
        }
        if (this.bufferLayer1) {
          this.bufferLayer1.getSource().clear()
        }
        if (this.bufferLayer2) {
          this.bufferLayer2.getSource().clear()
        }
        if (this.dataFlowLayer) {
          this.dataFlowLayer.getSource().clear()
        }
        if(this.heatLayer){
          this.heatLayer.getSource().clear()
        }
        this.overLay.setPosition(null)
        this.map.removeInteraction(this.drawInteraction)
        this.map.removeInteraction(this.drawInteraction1)
        clearInterval(this.timeInterval)
        switch (type) {
          case 1:
            break
          case 2:
            break
          case 3: {
            // let start = '114.491491,36.600531'
            // let end = '114.528461,36.637314'
            // api.getRoute({origin: start, destination: end}).then(res => {
            //   let steps = res.data.route.paths[0].steps
            //   let coords = []
            //   for (let j = 0; j < steps.length; j++) {
            //     if (steps[j]['polyline']) {
            //       let polyline = steps[j].polyline.split(';')
            //       polyline = polyline.map((value) => {
            //         return value.split(',').map(Number)
            //       })
            //       coords.push.apply(coords, polyline)
            //     }
            //   }
            //   let a = 0
            //   this.timeInterval = setInterval(() => {
            //     let yy = new Date().getFullYear()
            //     let mm = new Date().getMonth() + 1
            //     let dd = new Date().getDate()
            //     let hh = new Date().getHours()
            //     let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
            //       :
            //       new Date().getMinutes()
            //     let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
            //       :
            //       new Date().getSeconds()
            //     let dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
            //     this.content.innerHTML = dateTime
            //     console.log(coords[a])
            //     this.dataFlowLayer.getSource().addFeature(new Feature({
            //       geometry: new Point(coords[a])
            //     }))
            //     this.overLay.setPosition(coords[a])
            //     this.view.setCenter(coords[a])
            //     a += 1
            //     if (a >= coords.length - 1) {
            //       clearInterval(this.timeInterval)
            //     }
            //
            //   }, 500)
            // })

          }

            break
          case 4:
            ElMessage('点击地图查找周围医疗相关设施')
            this.map.addInteraction(this.drawInteraction)
            this.drawInteraction.on('drawend', async (value) => {
              let feature = value.feature
              let point = feature.getGeometry()
              let coord = point.getCoordinates()
              let coordStr = coord.join(',')
              let pois = []
              console.log(this.type)

              for (let i = 1; i < 40; i++) {
                let res = await api.getAround({
                  location: coordStr,
                  radius: this.bufferDistance,
                  types: this.type === 'hospital' ? this.hospitalTypes : this.pharmacyTypes,
                  page: i
                })
                if (!res.data['pois'].length) {
                  break
                } else {
                  pois = pois.concat(res.data.pois)
                }
              }
              let circle = new Feature({
                geometry: new Circle(coord, this.bufferDistance / 111000)
              })
              this.bufferLayer1.getSource().addFeature(circle)
              for (let i = 0; i < pois.length; i++) {
                let name = pois[i].name
                let location = pois[i].location.split(',').map(Number)
                let feature = new Feature({
                  geometry: new Point(location)
                })
                feature.setStyle(new Style({
                  image: new IconStyle({
                    src: './location.png',
                    scale: 0.2
                  }),
                  text: new TextStyle({
                    text: name
                  })
                }))
                this.bufferLayer1.getSource().addFeature(feature)
              }

            })
            break
          case 5:
            ElMessage('点击地图查找周围医疗相关设施')
            this.map.addInteraction(this.drawInteraction1)
            this.drawInteraction1.on('drawend', async (value) => {
              let feature = value.feature
              let point = feature.getGeometry()
              let coord = point.getCoordinates()
              let coordStr = coord.join(',')
              let pois = []
              // let res = await api.getAround({location: coordStr, radius: this.bufferDistance, keywords: '医院|药店'})
              for (let i = 1; i < 40; i++) {
                let res = await api.getAround({
                  location: coordStr,
                  radius: this.bufferDistance,
                  types: this.type === 'hospital' ? this.hospitalTypes : this.pharmacyTypes,
                  page: i
                })
                if (!res.data['pois'].length) {
                  break
                } else {
                  pois = pois.concat(res.data.pois)
                }
              }
              // pois = res.data.pois
              let circle = new Feature({
                geometry: new Circle(coord, this.bufferDistance2 / 111000)
              })
              this.bufferLayer2.getSource().addFeature(circle)
              for (let i = 0; i < pois.length; i++) {
                let name = pois[i].name
                let location = pois[i].location.split(',').map(Number)
                let feature = new Feature({
                  geometry: new Point(location)
                })
                feature.setStyle(new Style({
                  image: new IconStyle({
                    src: './location.png',
                    scale: 0.2
                  }),
                  text: new TextStyle({
                    text: name
                  })
                }))
                this.bufferLayer2.getSource().addFeature(feature)
                let res = await api.getRoute({origin: coordStr, destination: pois[i].location})
                let steps = res.data.route.paths[0].steps
                let coords = []
                for (let j = 0; j < steps.length; j++) {
                  if (steps[j]['polyline']) {
                    let polyline = steps[j].polyline.split(';')
                    polyline = polyline.map((value) => {
                      return value.split(',').map(Number)
                    })
                    coords.push.apply(coords, polyline)
                    if (j === steps.length - 1) {
                      let lineFeature = new Feature({
                        geometry: new LineString(coords)
                      })
                      this.bufferLayer2.getSource().addFeature(lineFeature)
                    }
                  }
                }
                console.log(coords)
              }

            })
            break
          case 6:{
            if(this.tempHeatPoints.length){
              this.heatLayer.getSource().addFeatures(this.tempHeatPoints)
            }else {
              ElMessage("第一次绘制需要较长时间，请等待...")
              let pois=[]
              this.tempHeatPoints=[]
              for (let i = 1; i < 40; i++) {
                let res=await api.getPlace({types:this.hospitalTypes,city:'邯郸市',citylimit:true,page:i})
                if (!res.data['pois'].length) {
                  break
                } else {
                  pois = pois.concat(res.data.pois)
                }
              }
              for (let i = 0; i < pois.length; i++) {
                let location = pois[i].location.split(',').map(Number)
                let feature = new Feature({
                  geometry: new Point(location)
                })
                this.heatLayer.getSource().addFeature(feature)
                this.tempHeatPoints.push(feature)
              }
              // this.heatLayer.getSource().addFeatures(this.tempHeatPoints)
              this.view.setCenter([114.467, 36.6])
            }
            
          
          }
          break
          default:
            return
        }
      },
      RandomNumBoth(Min, Max) {
        const Range = Max - Min;
        const Rand = Math.random();
        //四舍五入
        return Min + Math.round(Rand * Range);
      },
      onDataFlowClick(){
        let start = '114.491491,36.600531'
        let end = '114.528461,36.637314'
        api.getRoute({origin: start, destination: end}).then(res => {
          let steps = res.data.route.paths[0].steps
          let coords = []
          for (let j = 0; j < steps.length; j++) {
            if (steps[j]['polyline']) {
              let polyline = steps[j].polyline.split(';')
              polyline = polyline.map((value) => {
                return value.split(',').map(Number)
              })
              coords.push.apply(coords, polyline)
            }
          }
          let a = 0
          this.timeInterval = setInterval(() => {
            let yy = new Date().getFullYear()
            let mm = new Date().getMonth() + 1
            let dd = new Date().getDate()
            let hh = new Date().getHours()
            let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
              :
              new Date().getMinutes()
            let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
              :
              new Date().getSeconds()
            let dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
            this.content.innerHTML = dateTime
            console.log(coords[a])
            this.dataFlowLayer.getSource().addFeature(new Feature({
              geometry: new Point(coords[a])
            }))
            this.overLay.setPosition(coords[a])
            this.view.setCenter(coords[a])
            a += 1
            if (a >= coords.length - 1) {
              clearInterval(this.timeInterval)
            }

          }, 500)
        })
      },
      pageJump(){
        this.showType=7
        window.location="http://localhost:1467/luntan.aspx"
      }
    },
    watch: {
      showType(nVal) {
        this.refreshMap(nVal)
      }
    }
  }
</script>

<style>
  #app {
    position: absolute;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .main {
    position: absolute;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  #map {
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin: 0;
  }
  
  html body {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  
  .pos {
    position: absolute;
    z-index: 9;
    left: 25vw;
    top: 20px;
  }
  
  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
  }
  
  .ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  
  .ol-popup:after {
    
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  
  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }
</style>
