<template>
  <div id="trafficPointsApp">
    <base-map :base-layer="baseLayer" @mapCreated="onMapCreated">
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
    <el-select v-model="filterCopy"
    ></el-select>
      <el-date-picker
              v-model="timeExtent"
              type="datetimerange"
              range-separator="到"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
      />
    <el-select
        @change="onFilterChange"
        placeholder="请输入需要筛选的类型"
        default-first-option
        :reserve-keyword="false"
        style="position: fixed;right: 10px;bottom: 32vh;width: 20vw;"
        v-model="filter" clearable multiple allow-create filterable>
      <el-option v-for="(item,index) in filterList" :key="index"
                 :label="item"
                 :value="item"
      ></el-option>
    </el-select>
    <el-table
        ref="table"
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
    <el-button @click="goDraw" style="position: absolute;right: 40px;top: 20px" type="success">继续绘制</el-button>
    
    <el-button style="position: absolute;right: 40px;top: 80px" type="success" @click="exportCurData">导出当前</el-button>
    <el-upload style="position: absolute;right: 40px;top: 140px"
               action=""
               :auto-upload="false"
               :limit="1"
               :on-change="onFileChange"
               :file-list="fileList"
               ref="upload"
    >
      <el-button type="primary">点击导入</el-button>
    </el-upload>
  
  </div>
</template>

<script>

  import BaseMap from "../../components/BaseMap";
  import EditbarMinxin from "../../minxins/EditbarMinxin";
  import locationPng from './img/loc.png'
  import {Style, Fill, Circle, Stroke, Text as TextStyle} from 'ol/style'
  import {ElMessage} from 'element-plus'
  import {Vector as VectorLayer, Tile as TileLayer} from 'ol/layer'
  import {Vector as VectorSource,XYZ} from 'ol/source'
  import {guid} from "../../utils";
  import {saveAs} from 'file-saver'
  import GeoJSON from 'ol/format/GeoJSON'



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
          {value: '出租车', color: 'rgb(255,0,0)', uid: 1},
          {value: '小车', color: 'rgb(255,206,102)', uid: 2},
          {value: '货车', color: 'rgb(139,201,255)', uid: 3},
          {value: '客车', color: 'rgb(131,255,61)', uid: 4},
        ],
        images: {
          locationPng
        },
        color: 'rgb(255,0,0)',
        feature: null,
        features: [],
        xzVisible: false,
        featureLayer: null,
        imageLayer: null,
        fileList: [],
        filter: '',
        filterList: [],
        baseLayer:new TileLayer({
          source:new XYZ({
            url:'http://localhost:7000/data/{z}/{x}/{y}.png'
          })
        }),
        filterListCopy:[],
        filterCopy:[],
        timeExtent:[],
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
        this.featureLayer = new VectorLayer({
          source: new VectorSource()
        })
        map.addLayer(this.featureLayer)
        map.getView().setCenter([103.76452644459323,29.614513301086824])
        map.getView().setZoom(11)
      },
      onConfirmClick() {
        if (this.value === '') {
          ElMessage.warning('类型不能为空！')
        } else {
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
              scale: 1.2
            })

          }))
          this.feature.setProperties({
            type: this.value.value,
            uid: this.value.uid,
            color: this.value.color,
          })
          this.features.push({
            feature: this.feature,
            color: this.color,
            type: this.value.value,
            uid: this.value.uid,

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
        let ids = value.map(v => v.uid)
        let mFeature = this.features.filter(v => {
          return ids.includes(v['uid'])
        })
        mFeature = mFeature.map(v => v.feature)
        this.featureLayer.getSource().addFeatures(mFeature)
        this.m_vector.setVisible(false)
        this.m_editBar.setActive(false)
        this.featureLayer.setVisible(true)
        this.m_editBar.setVisible(false)
      },
      onXzClick() {
        this.xzVisible = true
      },
      exportCurData() {
        if (!this.features.length) return
        let geoJSON = {
          "type": "FeatureCollection",
          "features": [],
          types: this.types
        }
        this.features.forEach(f => {
          let feature = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": f.feature.getGeometry().getCoordinates()
            },
            "properties": {
              uid: f.uid,
              color: f.color,
              type: f.type
            }
          }
          geoJSON.features.push(feature)

        })
        const blob = new Blob([JSON.stringify(geoJSON)])
        saveAs(blob, '当前点.geojson')
      },
      onFileChange(file) {
        let reader = new FileReader();
        reader.readAsText(file.raw, "UTF-8");
        reader.onload = (e) => {
          let geojson = e.target.result;
          geojson = JSON.parse(geojson)
          this.types = geojson.types
          new GeoJSON().readFeatures(geojson).forEach(f => {
            let prp = f.getProperties()
            f.setStyle(new Style({
              image: new Circle({
                radius: 5,
                fill: new Fill({
                  color: prp.color
                })
              }),
              stroke: new Stroke({
                width: 1,
                color: 'rgb(0,0,0)'
              }),
              text: new TextStyle({
                text: prp.type,
                offsetY: 20,
                scale: 1.2
              })
            }))
            this.features.push({
              feature: f,
              color: prp.color,
              type: prp.types,
              uid: prp.uid,
            })
          })
          this.featureLayer.setSource(new VectorSource({
            features: this.features.map(f => f.feature),
          }))
          this.m_vector.getSource().clear()
          this.m_vector.getSource().addFeatures(this.features.map(f => f.feature))
          this.m_editBar.setActive(true)
          this.featureLayer.setVisible(true)
          this.m_editBar.setVisible(false)
          this.fileList = []
          this.$refs.upload.clearFiles()

        }
      },
      goDraw() {
        this.m_vector.setVisible(true)
        this.featureLayer.setVisible(false)
        this.m_editBar.setActive(true)
        this.m_editBar.setVisible(true)
      },
      onFilterChange(value) {
        let selectIndexs=[]
        this.types.forEach((t,index)=>{
          value.forEach(v=>{
            if(t.value.search(v)!==-1){
              selectIndexs.push(index)
            }
          })
          
        })
        for (let i = 0; i < this.types.length; i++) {
          if(selectIndexs.includes(i)){
            this.$refs.table.toggleRowSelection(this.types[i],true)
          }else {
            this.$refs.table.toggleRowSelection(this.types[i],false)

          }
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

