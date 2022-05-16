<template>
    <div class="nav-pane">
        <el-form label-suffix="：">
            <el-form-item label="起点">
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
                <el-button size="medium" style="padding: 10px 18px !important;" type="success"  v-show="isLocationShow" title="使用定位作为起点" @click="onLocationClick" icon="el-icon-add-location"></el-button>
            </el-form-item>
            <el-form-item label="终点">
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
            </el-form-item>
            <el-form-item>
                <el-button @click="confirmClick">确定</el-button>
                <el-button @click="resetClick">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import api from "../api";
    import {routeAnalysis} from "../utils";
    export default {
        name: "NavigationPane",
        data() {
            return {
                startInput: '',
                endInput: '',
                targetLocation: '',
                originLocation: ''
            }
        },
        props:{
            isLocationShow:{
                type:Boolean,
                default:()=>false
            }
        },
        methods: {
            async querySearchAsyncStart(queryString, cb) {
                let res = await api.getInputTips({keywords: queryString})
                let results = res.data.tips
                cb(results)
            },
            handleSelectStart(value) {
                this.startInput = value.name
                this.originLocation = value.location
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
                this.$emit('confirmClick', routeAnalysis(this.originLocation, this.targetLocation))
            },
            resetClick() {
                this.startInput = ''
                this.endInput = ''
                this.$emit('reset')
            },
            onLocationClick(){
                this.$emit('locationClick')
            }

        }
    }
</script>

<style lang="less" scoped>
    .nav-pane {
        position: absolute;
        top: 40px;
        left: 40px;
        z-index: 99;
        width: 400px;
        height: 250px;
        background: #54b2ff;
        display: flex;
        justify-content: center;
        border-radius: 4px;
    }
</style>