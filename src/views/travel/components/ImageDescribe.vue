<template>
    <div class="image-describe">
        <div class="image">
            <img style="width: 200px;height: 200px"  :src="img">
        </div>
        <div class="content">
            <div class="content-item" v-for="item in Object.keys(content)" :key="item">
                <span>{{item}}:</span>
                <span>{{content[item]}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ImageDescribe",
        props: {
            img: {
                type: String
            },
            content: {
                type: Object,
            }
        }
    }
</script>

<style lang="less" scoped>
    .image-describe {
        display: flex;
        flex-direction: row;
        .content{
            margin-left: 10px;
            align-content: center;
            justify-content: space-evenly;
            height: 150px;
            display: flex;
            flex-direction: column;
            .content-item{
                display: flex;

            }
        }
    }
</style>