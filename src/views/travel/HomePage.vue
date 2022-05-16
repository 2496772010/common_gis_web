<template>
    <div class="travel-home">
        <el-container class="container">
            <el-header class="header" style="background-image: url('./jdImgs/handan.jpeg')">
              基于GIS的邯郸旅游系统
            </el-header>
            <el-container class="main-container">
                <el-aside class="aside">
                    <el-menu default-active="0-0">
                        <el-submenu v-for="(item,index) in menus1" :key="index.toString()" :index="index.toString()">
                            <template v-slot:title>
                                <span>{{item.label}}</span>
                            </template>
                            <el-menu-item @click="path=ite.path" v-for="(ite,idx) in item.children" :key="idx"
                                          :index="index+'-'+idx">
                                <template v-slot>
                                    <span>{{ite.label}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main class="main">
                    <iframe id="linkModel-iframe" :src="path" frameborder="no" style="width:100%;height: 99%;"></iframe>
                </el-main>
            </el-container>

        </el-container>
    </div>
</template>

<script>
    const headUrl=window.location.href.split('#')[0]+'#'
    export default {
        name: "HomePage",
        data() {
            return {
                menus: [
                    {
                        label: '导航模块',
                        children: [
                            {
                                label: '景点导航',
                                path: '/travel.html#/jdNav',
                            }, {
                                label: '酒店导航',
                                path: '/travel.html#/travel/jiuDNav'

                            }, {
                                label: '车站导航',
                                path: '/travel.html#/travel/staNav'
                            },
                        ]
                    },
                    {
                        label: '分析模块',
                        children: [
                            {
                                label: '自驾可视化',
                                path: '/travel.html#/travel/zjVision'
                            }, {
                                label: '景点热力图',
                                path: '/travel.html#/travel/jdHeat'
                            }
                        ]
                    },
                    {
                        label: '走进邯郸',
                        children: [
                            {
                                label: '文博邯郸',
                                path: '/travel.html#/travel/artHandan'
                            },
                            {
                                label: '山水邯郸',
                                path: '/travel.html#/travel/waterHandan'
                            },
                            {
                                label: '艺术邯郸',
                                path: '/travel.html#/travel/civilHandan'
                            },
                        ]
                    }
                ],
                menus1: [
                    {
                        label: '周围有什么',
                        children: [
                            {
                                label: '景点导航',
                                path: headUrl+'/jdNav',
                            }, {
                                label: '酒店导航',
                                path: headUrl+'/travel/jiuDNav'

                            }, {
                                label: '车站导航',
                                path: headUrl+'/travel/staNav'
                            },
                        ]
                    },
                    {
                        label: '我该怎么去',
                        children: [
                            {
                                label: '自驾可视化',
                                path:headUrl+'/travel/zjVision'
                            }, {
                                label: '景点热力图',
                                path: headUrl+'/travel/jdHeat'
                            }
                        ]
                    },
                    {
                        label: '走进邯郸',
                        children: [
                            {
                                label: '文博邯郸',
                                path: headUrl+'/travel/artHandan'
                            },
                            {
                                label: '山水邯郸',
                                path: headUrl+'/travel/waterHandan'
                            },
                            {
                                label: '艺术邯郸',
                                path: headUrl+'/travel/civilHandan'
                            },
                        ]
                    }
                ],
                path: headUrl+'/jdNav'
            }
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang="less" scoped>
    @import "./css/Homepage";

</style>
