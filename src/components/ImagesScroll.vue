<template>
    <div class="images-scroll">
        <div @click="$emit('imgclick',item)" class="scroll-item" v-for="(item,index) in imgs" :key="index">
            <img v-if="item['img']" :src="item['img']"/>
            <span>{{item.name.split('.')[0]}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ImagesScroll",
        props: {
            imgs: {
                type: Array,
                default: () => []
            }
        }
    }
</script>

<style lang="less" scoped>
    .images-scroll {
        display: flex;
        justify-content: space-evenly;
        width: 30vw;
        flex-basis: 30vw;
        flex-shrink: 0;
        overflow-x: auto;
        background: white;
        align-items: center;
        border-radius: 4px;
        border: 1px solid gray;

        .scroll-item {
            width: 15vh;
            height: 15vh;
            text-align: center;
            margin-left: 10px;

            img {
                width: inherit;
                height: inherit;
                object-fit: cover;
                cursor: pointer;
            }
        }
    }
</style>