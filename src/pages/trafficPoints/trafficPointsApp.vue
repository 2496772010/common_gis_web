<template>
    <div id="trafficPointsApp">
        <base-map ></base-map>

    </div>
</template>

<script>

    import BaseMap from "../../components/BaseMap";

    export default {
        name: "trafficPointsApp",
        components: {BaseMap},
        data() {
            return {}
        },
        methods: {}
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

