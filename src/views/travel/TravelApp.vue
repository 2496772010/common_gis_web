<template>
    <div id="travelApp">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "TravelApp"
    }
</script>

<style scoped>
    #travelApp {
        width: 100%;
        height: 100%;
        position: absolute;

    }

    body {
        padding: 0;
        margin: 0;
    }
</style>
