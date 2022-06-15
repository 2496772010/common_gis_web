<template>
  <div class="nav-pane">
    <el-form  label-suffix="：" label-width="auto" inline label-position="right">
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
      <el-form-item label="范围">
        <el-input-number :min="1000" :max="10000" :v-model="distance"></el-input-number>
        m
      </el-form-item>
      <el-form-item  style="display: flex;justify-content: center;align-items: center">
        <el-button @click="confirmClick">确定</el-button>
        <el-button @click="resetClick">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from "../../../api";
  import {aroundAnalysis} from "../../../utils";
  import {TRAVEL_CODES, restaurant_code, vecation_code} from "../../../config/GaoDeCodeconfig";
  import {toRaw} from '@vue/reactivity';

  export default {
    name: "NavPane",
    props: {
      mode: {type: String, default: () => ''}
    },
    data() {
      return {
        startInput: '',
        endInput: '',
        targetLocation: '',
        originLocation: '',
        distance: 3000
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
        let obj = {
          "酒店": restaurant_code,
          "景点": TRAVEL_CODES,
          "车站": vecation_code
        }
        this.$emit('confirmClick',
          {
            source: aroundAnalysis(this.originLocation, this.distance, obj[this.mode], this.mode),
            point: this.originLocation
          }
        )
      },
      resetClick() {
      }

    }
  }
</script>

<style lang="less" scoped>
  .nav-pane {
    position: absolute;
    top: 30px;
    left: 40px;
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
