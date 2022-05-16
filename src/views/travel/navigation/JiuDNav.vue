<template>
    <div>
        <base-map @mapCreated="onMapCreated">
        </base-map>
        <nav-pane mode="酒店" @confirmClick='confirmClick'></nav-pane>
        <image-describe ref="imgDesc" :img="img" :content="content"></image-describe>

    </div>
</template>

<script>
    import BaseMap from "../../../components/BaseMap";
    import NavPane from "../components/NavPane";
    import {Vector as VectorLayer} from 'ol/layer'
    import {Point} from 'ol/geom'
    import {Select} from 'ol/interaction'
    import Popup from 'ol-ext/overlay/Popup'
    import 'ol-ext/overlay/Popup.css'
    import 'ol-ext/overlay/Popup.anim.css'
    import ImageDescribe from "../components/ImageDescribe";

    export default {
        name: "jiuDNav",
        components: {NavPane, BaseMap, ImageDescribe},
        data() {
            return {
                map: null,
                jdLayer: new VectorLayer({}),
                select: null,
                popup: null,
                img: '',
                content: {}
            }
        },
        mounted() {
        },
        methods: {
            onMapCreated(map) {
                this.map = map
                this.map.addLayer(this.jdLayer)
                this.select = new Select({})
                this.map.addInteraction(this.select)
                this.popup = new Popup({
                    popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
                    closeBox: true,
                    onshow: function () {
                        console.log("You opened the box");
                    },
                    onclose: function () {
                        console.log("You close the box");
                    },
                    autoPan: true,
                    autoPanAnimation: {duration: 250}
                })
                this.map.addOverlay(this.popup)
                this.initSelect()
            },
            async confirmClick(res) {
                let source = await res.source;
                this.map.getView().setCenter(res.point.split(','))
                this.jdLayer.setSource(source)
                this.map.render()
            },
            change(img, content) {
                return new Promise((resolve => {
                    this.img = img
                    this.content = content
                    resolve('ok')
                }))
            },
            initSelect() {
                this.select.getFeatures().on(['add'], (e) => {
                    const feature = e.element;
                    if (feature.getGeometry() instanceof Point) {
                        let properties = feature.getProperties().properties
                        console.log(properties)
                        let img = properties['photos'] && properties['photos'].length ? properties['photos'][0].url : ''
                        let content = {
                            '名字': properties.name,
                            '地址': properties.address,
                            '最低价格': "￥" + properties['biz_ext']['lowest_price'],
                            '电话': properties['tel']
                        }
                        this.change(img, content).then(() => {
                            let domContent = this.$refs.imgDesc.$el.outerHTML
                            this.popup.show(feature.getGeometry().getFirstCoordinate(), domContent);
                        })

                    }

                });
                this.select.getFeatures().on(['remove'], function () {
                    this.popup.hide();
                })
            }
        }
    }
</script>

<style scoped>

</style>