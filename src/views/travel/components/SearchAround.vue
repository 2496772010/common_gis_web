<template>
  <div class="nav-pane">
    <el-form label-suffix="：" inline label-position="right" label-width="auto" size="mini">
      <el-form-item label="小区">
        <el-autocomplete
            v-model="startInput"
            :fetch-suggestions="querySearchAsyncStart"
            :placeholder="'请输小区名查找'+mode"
            @select="handleSelectStart"
        >
          <template #default="{ item }">
            <div class="name">{{ item.name }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="设施类型">
        <el-select v-model="houseType">
          <el-option v-for="(item,index) in codes"
                     :label="item.label"
                     :value="item.value"
                     :key="index">
          
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="范围">
        <el-input-number :min="1000" :max="10000" v-model="distance" step="100">
        
        </el-input-number>
        m
      </el-form-item>
      <el-form-item style="display: flex;justify-content: center;align-items: center">
        <el-button @click="confirmClick">确定</el-button>
        <el-button @click="resetClick">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from "../../../api";
  import {aroundAnalysis} from "../../../utils";
  import {toRaw} from '@vue/reactivity';
  import {GYM_CODE, MEDICAL_CODE, SHOP_CODE, vecation_code} from "../../../GaoDeCodeconfig";


  export default {
    name: "SearchAround",
    props: {
      mode: {type: String, default: () => ''}
    },
    data() {
      return {
        startInput: '',
        endInput: '',
        targetLocation: '',
        originLocation: '',
        houseType: vecation_code,
        distance: 1000,
        codes: [{
          label: '购物',
          value: SHOP_CODE
        }, {
          label: '交通',
          value: vecation_code
        }, {
          label: '医疗',
          value: MEDICAL_CODE
        }, {
          label: '体育休闲',
          value: GYM_CODE
        }
        ]
      }
    },
    methods: {
      async querySearchAsyncStart(queryString, cb) {
        let res = await api.getInputTips({keywords: queryString})
        let results = res.data.tips
        cb(results)
      },
      async handleSelectStart(value) {
        let value1 = toRaw(value)
        this.startInput = value1.name
        this.originLocation = value1.location
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
      confirmClick() {
        this.$emit('confirmClick',
          {
            source: aroundAnalysis(this.originLocation, this.distance, this.houseType, this.mode),
            point: this.originLocation
          }
        )
      },
      resetClick() {
        this.distance = 1000
        this.startInput = ''
        this.$parent.layer.getSource().clear()
      }

    }
  }
</script>

<style lang="less" scoped>
  .nav-pane {
    position: absolute;
    top: 30px;
    left: 80px;
    z-index: 99;
    width: 300px;
    height: 200px;
    background: #54b2ff;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    opacity: 0.75;
    padding: 10px;
  }
</style>
