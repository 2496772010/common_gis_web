<template>
  <div class="nav-pane">
    <el-form  label-suffix="：" inline label-position="right" label-width="auto" size="mini">
      <el-form-item label="起点">
        <el-autocomplete
            v-model="startInput"
            :fetch-suggestions="querySearchAsyncStart"
            :placeholder="'请输起点查找'+mode"
            @select="handleSelectStart"
        >
          <template #default="{ item }">
            <div class="name">{{ item.name }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="房源类型">
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
  

  export default {
    name: "AroundSearch",
    props: {
      mode: {type: String, default: () => ''}
    },
    data() {
      return {
        startInput: '',
        endInput: '',
        targetLocation: '',
        originLocation: '',
        houseType: '120302',
        distance: 1000,
        codes: [{
          label: '商务住宅相关',
          value: '120000'
        }, {
          label: '楼宇相关',
          value: '120100'
        }, {
          label: '商务写字楼',
          value: '120201'
        }, {
          label: '商住两用楼',
          value: '120203'
        }, {
          label: '住宅区',
          value: '120300'
        }, {
          label: '别墅',
          value: '120301'
        },
          {
            label: '住宅小区',
            value: '120302'
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
