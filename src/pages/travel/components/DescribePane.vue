<template>
    <div :id="id" class="describe-pane">
        <div class="describe-title">{{name}}</div>
        <div v-for="(item,index) in contentList" :key="index">
            <img style="width: 100px;height: 100px" fit="cover" :src="item.img">
            <br>
            <span>{{item.content}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DescribePane",
        props: {
            id: {
                type: String,
                default() {
                    return new Date().getTime().toString()
                }
            },
            contentList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            name: {
                type: String,
                default: () => ''
            }
        }
    }
</script>

<style lang="less" scoped>
    .describe-pane {
        display: flex;
        flex-direction: column;
        width: 300px;
        height: 450px;
        overflow: hidden scroll;

        .describe-title {
            width: 300px;
            height: 30px;
            margin-bottom: 10px;
            font-size: 20px;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-content: center;
        }

        .describe-imgs {
            width: 390px;
            height: 150px;
        }
    }

</style>