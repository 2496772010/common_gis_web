<template>
    <div>
        <base-map @mapCreated="onMapCreated">
        </base-map>
        <el-button type="primary" style="position:absolute;z-index: 99;left: 50%;transform: translateX(-50%)"
                   @click="playRoute(source)">重播
        </el-button>
        <describe-pane :name="name" ref="describePane" id="describePane" :contentList="describe"></describe-pane>
    </div>
</template>

<script>
    import BaseMap from "../../../components/BaseMap";
    import {Vector as VectorLayer} from 'ol/layer'
    import {Vector as VectorSource} from 'ol/source'
    import {Point, LineString} from 'ol/geom'
    import Feature from 'ol/Feature'
    import DescribePane from "../components/DescribePane";
    import Popup from 'ol-ext/overlay/FixedPopup'
    import 'ol-ext/overlay/Popup.css'
    import 'ol-ext/overlay/Popup.anim.css'
    import {ref} from 'vue'
    import {Style, Text as TextStyle, Icon as IconStyle, Fill as FillStyle} from 'ol/style'
    import {Select} from 'ol/interaction'

    export default {
        name: "WaterHandan",
        components: {BaseMap, DescribePane},
        data() {
            return {
                routeCoords: [
                    {
                        name: '京娘湖',
                        center: [113.947389, 36.900837],
                        style: new Style({
                            text: new TextStyle({
                                text: '京娘湖',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/jlh.jpg',
                                scale: 0.08
                            })
                        }),
                        desc: [
                            {
                                img: './handan/jlh1.png',
                                content: '【京娘湖传说】京娘姓赵，年方十七岁，随父去曲阳烧香还愿遭劫，幸遇 赵匡胤拔刀相救。年少轻狂的赵匡胤因得罪朝廷而闯荡江湖，走遍了天下各地，匡胤与京娘结为兄妹并独行千里护送京娘回家。一路匡胤步行，京娘骑马，千里送其回家，一路上赵匡胤对京娘体贴关怀。途径武安门道川，京娘晨起，临渊梳妆，匡胤侠骨柔肠感动京娘，京娘向赵匡胤诉说爱慕之情。匡胤踌躇满志，婉言回绝。\n' +
                                    '另据冯梦龙《警世通言》记载，赵匡胤千里送京娘，京娘愿以终身相托，然而赵匡胤曰：“贤妹非是俺胶柱鼓瑟，本为义气千里相送，今若就私情与那个响马何异？况施恩图报非君子所为”。京娘道：“恩兄高见，妾今生不能补报大德，死当衔环结草”。于是京娘投湖自尽，又说是因受到兄嫂猜疑而自尽（后被追封为贞义夫人），京娘湖亦由此得名。\n'
                            }
                        ]
                    },
                    {
                        name: '古武当山',
                        center: [113.951857, 36.950466],
                        style: new Style({
                            text: new TextStyle({
                                text: '古武当山',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/gwds.jpg',
                                scale: 0.2
                            })
                        }),
                        desc: [
                            {
                                img: './handan/gwds.jpg',
                                content: '武当山，位于河北省邯郸市武安市西北的太行山深处，距邯郸市70公里，景区面积20多平方公里。国家地质公园，国家森林公园。\n' +
                                    '古武当山始建于唐贞观年间。山顶一唐代古碑上记载此为古武当山，经专家考证认定是久为国内道教界寻找的著名的北武当山，其历史早于国内其它武当山。古武当山上庙主峰海拨1437.7米，真武古庙建在山的极顶处，庙内供奉着道教大神真武大帝和太极宗师张三丰。' +
                                    '山上留有真武修行和道教张三丰传播太极拳的故事，是河北地区太极拳和道教传播的重要历史文化之一。' +
                                    '武当山自然风光秀美，文物古迹众多，山势奇特，五峰相望，顶顶有庙，峰峰插天，杆被繁茂，满山葱郁。庙主峰海拔1437.7米，真武庙建在山顶处，庙内供着道大神真武大帝和太极宗师张三丰。北顶老爷顶，南顶奶奶顶，中间有一天桥连接。置身山顶，极目远望，遍山水云水，如入仙境。张三丰古练功场，四周山形千姿百态，处处显现着大自然的灵气。著名的有“阳山奇观”' +
                                    '、“大鹏展翅”、“神猴献瑞”、“毛公峰”、“鲁迅峰”、“太极掌”等，鬼斧神工，惟妙惟肖。下庙的药王庙、碧霞丹君庙、真武庙，无不体现着武当道教和太极养生文化。国家地质公园、森林公园古武当山景区位于邯郸市武安市西40公里的太行山深处，是神话《北游记》故事的发源地、国内著名的道教圣地。古老秀美的山川、神奇悠久的传说，雄浑峻秀的山势，以及浓厚的文化底蕴，越发增加了古武当山的神秘。'
                            }
                        ]
                    },
                    {
                        name: '长寿村',
                        center: [113.817653, 36.991975],
                        style: new Style({
                            text: new TextStyle({
                                text: '长寿村',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/csc.jpg',
                                scale: 0.2
                            })
                        }),
                        desc: [
                            {
                                img: './handan/csc.jpg',
                                content: '长寿村旅游风景区地处太行山南麓河北省武安市境内，距武安市区56公里，西与山西省左权县毗邻，北与邢台市邢台县相望。\n' +
                                    '景区以“空气好，水好”而闻名遐迩。拥有南太行最高峰青崖寨（海拔1898米）和南太行第二高峰摩天岭（海拔1747.5米），自然古村落长寿村位于摩天岭脚下，有鸡鸣三省之地利，四水源头(清漳河、沙河、南洺河、北洺河)之泉壑，米寿人仁之气和。峻\n' +
                                    '极峰险，山高水美，绿树荫荫。是武安国家地质公园、武安国家森林公园和青崖寨国家自然保护区，“两园一区”的中心区域。这里以山称奇，以水增寿，以寿闻名。'
                            }
                        ]
                    },
                ],
                timeInterval: null,
                civilLayer: new VectorLayer({}),
                overLay: null,
                describe: [],
                source: null,
                name: '',
                select: null
            }
        },
        setup() {
            return {
                map: ref(null)
            }
        },
        methods: {
            onMapCreated(map) {
                this.map = map
                this.init(map)
            },
            init(map) {
                map.addLayer(this.civilLayer)
                this.source = new VectorSource()
                this.civilLayer.setSource(this.source)
                this.overLay = new Popup({
                    popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
                    closeBox: true,
                    onshow: function () {
                        console.log("You opened the box");
                    },
                    onclose: function () {
                        console.log("You close the box");
                    },
                    positioning: 'top-right',
                    autoPan: true,
                    autoPanAnimation: {duration: 250}
                })
                map.addOverlay(this.overLay)
                // this.playRoute(this.source)
                this.select = new Select({})
                this.map.addInteraction(this.select)
                this.initSelect()
            },
            change(desc, name) {
                return new Promise(resolve => {
                    this.describe = desc
                    this.name = name
                    resolve('ok')

                })
            },
            playRoute(source) {
                if (source) {
                    clearInterval(this.timeInterval)
                    this.timeInterval = null
                    let a = 0
                    this.timeInterval = setInterval(() => {
                        if (a >= this.routeCoords.length) {
                            clearInterval(this.timeInterval)
                            return
                        }
                        let center = this.routeCoords[a].center
                        let desc = this.routeCoords[a].desc
                        let name = this.routeCoords[a].name
                        let style = this.routeCoords[a].style
                        let point = new Feature({
                            geometry: new Point(center),
                            properties: {
                                desc: desc
                            }
                        })
                        point.setStyle(style)
                        point.setProperties({
                            titleName: name,
                            desc: desc
                        })
                        source.addFeature(point)
                        if (a < this.routeCoords.length - 1) {
                            let center1 = this.routeCoords[a + 1].center
                            let line = new Feature({
                                geometry: new LineString([center, center1])
                            })
                            source.addFeature(line)
                        }
                        this.change(desc, name).then(() => {
                            this.overLay.show(center, this.$refs.describePane.$el.outerHTML)
                            this.overLay.setPixelPosition([10, 10], 'top-right')
                            this.map.getView().setCenter(center)
                        })

                        a += 1
                    }, 4000)
                }
            },
            initSelect() {
                this.select.getFeatures().on(['add'], (e) => {
                    const feature = e.element;
                    if (feature.getGeometry() instanceof Point) {
                        let properties = feature.getProperties()
                        console.log(properties)
                        this.change(properties.desc, properties.titleName).then(() => {
                            let domContent = this.$refs.describePane.$el.outerHTML
                            this.overLay.show(feature.getGeometry().getFirstCoordinate(), domContent);
                        })

                    }

                });
                this.select.getFeatures().on(['remove'], function () {
                    this.overLay.hide();
                })
            }
        }
    }
</script>

<style scoped>

</style>