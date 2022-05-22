<template>
    <div id="trafficPointsApp">
        <base-map @mapCreated="onMapCreated">
        </base-map>
        <el-dialog
                v-model="dialogVisible"
                title="添加点"
                width="30%"
                show-close
                draggable
        >
            <el-form label-suffix="：">
                <el-form-item label="点类型"></el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>

    import BaseMap from "../../components/BaseMap";
    import EditbarMinxin from "../../minxins/EditbarMinxin";

    export default {
        name: "trafficPointsApp",
        components: {BaseMap},
        mixins: [EditbarMinxin],
        data() {
            return {
                dialogVisible: false
            }
        },
        mounted() {

        },
        methods: {
            onMapCreated(map) {
                this.initMyMap(map)
                this.m_editBar.getInteraction('DrawPoint').on('drawstart', (e) => {
                    console.log(e)
                    this.dialogVisible = true
                    // this.m_tooltip.setInfo(e.oldValue ? '' : 'Click map to place a point...');
                });
            }
        }
    }
</script>

<style scoped>
    #trafficPointsApp {
        width: 100%;
        height: 100%;
        position: absolute;
        padding: 0;
        margin: 0;

    }
</style>

